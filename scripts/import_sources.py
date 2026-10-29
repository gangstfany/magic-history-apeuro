#!/usr/bin/env python3
"""Import privately supplied sprintcards, current CED text and AMSCO text.

Supply --cards-dir, --ced-text and --reading-index; no private files are bundled.
U assignments are parsed as literals, never imported or executed. Any appended
statement is rejected for review. Alignment is inherited from authored block tags,
not asserted to be a row-specific pinpoint citation. AMSCO topic locators are used
instead of page numbers because extraction pagination is not a reliable printed
page locator (PDF page 47 is printed page 1 in the supplied second edition).
"""
import argparse
import ast
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re


class PlainText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
    def handle_data(self, data):
        self.parts.append(data)
    def handle_starttag(self, tag, attrs):
        if tag in {'br', 'p', 'div', 'li'}:
            self.parts.append(' ')
    def handle_endtag(self, tag):
        if tag in {'p', 'div', 'li'}:
            self.parts.append(' ')


def plain(value):
    parser = PlainText()
    parser.feed(str(value))
    return re.sub(r'\s+', ' ', html.unescape(''.join(parser.parts)).replace('{{', '').replace('}}', '')).strip()


def bilingual(pair):
    if not isinstance(pair, (list, tuple)) or len(pair) != 2:
        raise ValueError('Expected an authored Chinese/English pair')
    return dict(zip(('zh', 'en'), map(plain, pair)))


def read_unit(path):
    tree = ast.parse(path.read_text(encoding='utf-8'), filename=path.name)
    # Do not silently ignore mutations or executable statements after U.
    if len(tree.body) != 1 or not isinstance(tree.body[0], ast.Assign):
        raise ValueError(f'{path.name}: expected only one literal U assignment; review appended statements')
    assignment = tree.body[0]
    if len(assignment.targets) != 1 or not isinstance(assignment.targets[0], ast.Name) or assignment.targets[0].id != 'U':
        raise ValueError(f'{path.name}: expected U assignment')
    return ast.literal_eval(assignment.value)


def read_topics(text):
    topics = {}
    stop = r'\n(?:SUGGESTED SKILL|THEMATIC FOCUS|LEARNING OBJECTIVE|HISTORICAL DEVELOPMENTS|Unit \d+:|The final topic|Spend a class period)'
    for match in re.finditer(r'^TOPIC (\d+\.\d+)\s*\n(.*?)(?=' + stop + ')', text, re.M | re.S):
        title = re.sub(r'\b(?:Required Course Content|continued on next page)\b', '', match[2])
        title = plain(title)
        if len(title) < 200:
            topics[match[1]] = title
    expected = [11, 8, 8, 7, 9, 10, 9, 11, 15]
    expected_ids = {f'{u}.{t}' for u, count in enumerate(expected, 1) for t in range(1, count + 1)}
    if set(topics) != expected_ids:
        raise ValueError(f'CED extraction missing or unexpected topics: {expected_ids ^ set(topics)}')
    return topics


def block_topics(tag):
    prefix = tag.split('·')[0]
    result = []
    for match in re.finditer(r'(\d+)\.(\d+)(?:[–-](?:(\d+)\.)?(\d+))?', prefix):
        unit, start = int(match[1]), int(match[2])
        end = int(match[4]) if match[4] else start
        if match[3] and int(match[3]) != unit:
            raise ValueError('Cross-unit range requires explicit review')
        result.extend(f'{unit}.{n}' for n in range(start, end + 1))
    return result


def build(cards_dir, ced_text, amsco_text):
    topics = read_topics(ced_text)
    sources = [
        {'id': 'ced-2026', 'title': 'AP European History Course and Exam Description', 'url': 'https://apcentral.collegeboard.org/courses/ap-european-history', 'edition': 'Effective Fall 2026; Course Framework V.1'},
        {'id': 'amsco', 'title': 'AMSCO Advanced Placement European History', 'url': 'https://www.perfectionlearning.com/', 'edition': 'Second edition, © 2023'},
    ]
    course = {'version': 1, 'sources': sources, 'units': [], 'cards': []}
    for number in range(1, 10):
        original = read_unit(cards_dir / f'unit{number}.py')
        if original['n'] != number:
            raise ValueError('Unit filename and number differ')
        sources.append({'id': f'cards-u{number}', 'title': f'考前冲刺记忆卡 · Unit {number}', 'url': '', 'edition': 'User-authored bilingual sprintcards'})
        unit = {'id': number, 'title': bilingual(original['name']), 'dates': plain(original['dates']),
                'topics': [{'id': key, 'titleEn': topics[key]} for key in sorted(topics, key=lambda x: tuple(map(int, x.split('.')))) if key.startswith(f'{number}.')],
                'story': list(map(bilingual, original['story'])), 'blocks': []}
        final = original['final']
        if len(final['A']) != len(final['Aans']) or len(final['B']) != len(final['Bans']):
            raise ValueError('Mismatched final review prompts and supplied answers')
        unit['finalReview'] = [
            {'id': f'u{number}-review-a{i}', 'origin': 'user-authored', 'question': bilingual(question), 'answer': bilingual(answer)}
            for i, (question, answer) in enumerate(zip(final['A'], final['Aans']), 1)
        ] + [
            {'id': f'u{number}-review-b{i}', 'origin': 'user-authored', 'skill': question[0], 'question': bilingual(question[1]), 'answerEn': plain(answer)}
            for i, (question, answer) in enumerate(zip(final['B'], final['Bans']), 1)
        ]
        for block_no, original_block in enumerate(original['blocks'], 1):
            block_id = f'u{number}-b{block_no}'
            topic_ids = block_topics(original_block['tag'][0])
            if not topic_ids or any(key not in topics for key in topic_ids):
                raise ValueError(f'{block_id}: invalid authored topic tag')
            for key in topic_ids:
                # Confirm the supplied textbook actually contains these topic IDs.
                if not re.search(r'\b' + re.escape(key) + r'\b', amsco_text):
                    raise ValueError(f'AMSCO topic {key} could not be verified')
            themes = re.findall(r'\b(?:INT|ECD|CID|SOP|SCD|NEI|TSI)\b', original_block['tag'][0])
            block = {'id': block_id, 'title': bilingual(original_block['title']), 'theme': bilingual(original_block['theme']), 'topicIds': topic_ids, 'themes': themes, 'cardIds': []}
            if len(original_block['quiz']) != len(original_block['ans']):
                raise ValueError(f'{block_id}: mismatched retrieval questions and answers')
            block['checks'] = [
                {'id': f'{block_id}-q{i}', 'origin': 'user-authored', 'question': bilingual(question), 'answer': bilingual(answer)}
                for i, (question, answer) in enumerate(zip(original_block['quiz'], original_block['ans']), 1)
            ]
            block['comparisons'] = [
                {'caption': bilingual(table['cap']), 'headers': list(map(bilingual, table['head'])),
                 'rows': [list(map(bilingual, row)) for row in table['rows']]}
                for table in original_block.get('snaps', [])
            ]
            block['essayEvidence'] = [{'skill': skill, 'textEn': plain(text)} for skill, text in original_block['ammo']]
            block['mnemonic'] = {'title': bilingual(original_block['mnemo'][0]), 'text': bilingual(original_block['mnemo'][1])}
            for row_no, row in enumerate(original_block['rows'], 1):
                card_id = f'{block_id}-c{row_no}'
                block['cardIds'].append(card_id)
                locator = ', '.join(f'Topic {key}' for key in topic_ids) + ' (block-level alignment; not row-specific verification)'
                course['cards'].append({'id': card_id, 'unit': number, 'blockId': block_id, 'title': bilingual(row['kw']), 'date': plain(row['t']), 'skill': row['sk'], 'summary': bilingual(row['trig']), 'detail': bilingual(row['det']), 'topicIds': topic_ids.copy(), 'themes': themes.copy(), 'sources': [
                    {'sourceId': f'cards-u{number}', 'locator': f'block{block_no},row{row_no}'},
                    {'sourceId': 'amsco', 'locator': locator},
                    {'sourceId': 'ced-2026', 'locator': locator},
                ]})
            unit['blocks'].append(block)
        course['units'].append(unit)
    return course


def apply_revisions(course, ledger_path):
    """Apply reviewed field edits only when the original imported value matches.

    Stable entity IDs plus field paths avoid depending on card array ordering.
    Any future author change causes an explicit review failure rather than being
    silently overwritten by an obsolete editorial correction.
    """
    ledger = json.loads(ledger_path.read_text(encoding='utf-8'))
    if ledger['version'] != 1:
        raise ValueError('Unsupported content revision ledger version')
    entities = {}
    def index(value):
        if isinstance(value, list):
            for item in value:
                index(item)
        elif isinstance(value, dict):
            if 'id' in value:
                identifier = value['id']
                entities[f'unit:{identifier}' if isinstance(identifier, int) else identifier] = value
            for item in value.values():
                index(item)
    index(course)
    for revision in ledger['revisions']:
        target = entities[revision['targetId']]
        parts = revision['field'].split('.')
        for part in parts[:-1]:
            target = target[int(part)] if isinstance(target, list) else target[part]
        key = int(parts[-1]) if isinstance(target, list) else parts[-1]
        if target[key] != revision['before']:
            raise ValueError(f"Review stale revision: {revision['targetId']}.{revision['field']}")
        if not revision['reason'] or not revision['evidence']:
            raise ValueError('Revisions require reasons and evidence locators')
        target[key] = revision['after']
    return course


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cards-dir', type=Path, required=True)
    parser.add_argument('--ced-text', type=Path, required=True)
    parser.add_argument('--reading-index', type=Path, required=True)
    parser.add_argument('--revisions', type=Path, default=Path(__file__).resolve().parents[1] / 'data/content-revisions.json')
    parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parents[1] / 'data/course.json')
    args = parser.parse_args()
    index = json.loads(args.reading_index.read_text())
    matches = [entry for entry in index if entry['path'] == 'AMSCO - AP European History 2nd Ed.pdf']
    if len(matches) != 1:
        raise ValueError('Expected exactly one AMSCO second-edition extraction')
    amsco = Path(matches[0]['text_file']).read_text()
    course = build(args.cards_dir, args.ced_text.read_text(), amsco)
    apply_revisions(course, args.revisions)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(course, ensure_ascii=False, indent=2) + '\n')
    print(f"Imported {len(course['units'])} units, {sum(len(u['blocks']) for u in course['units'])} blocks, {len(course['cards'])} cards, {sum(len(u['topics']) for u in course['units'])} CED topics")


if __name__ == '__main__':
    main()
