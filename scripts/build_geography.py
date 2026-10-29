#!/usr/bin/env python3
"""Build offline geography and explicit-name card links. Stdlib only.
Run: python3 scripts/build_geography.py [--geojson /path/to/ne_110m_admin_0_countries.geojson]
No network is used. A local source file rebuilds SVG/provenance; without it only
places and links are refreshed. Modern country outlines are context, not historical borders.
"""
import argparse
import hashlib
import html
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'
TERMS = 'https://www.naturalearthdata.com/about/terms-of-use/'
# Manually rounded educational anchors, not gazetteer/survey coordinates.
# id | English | Chinese | kind | longitude | latitude | region | English aliases
DEFINITIONS = '''
vendee|Vendée|旺代|region|-1.3|46.7|Europe|Vendee
new-lanark|New Lanark|新拉纳克|city|-3.78|55.66|Europe|
florence|Florence|佛罗伦萨|city|11.26|43.77|Europe|
rome|Rome|罗马|city|12.50|41.90|Europe|
mainz|Mainz|美因茨|city|8.25|50|Europe|
wittenberg|Wittenberg|维滕贝格|city|12.65|51.87|Europe|
worms|Worms|沃尔姆斯|city|8.36|49.63|Europe|
augsburg|Augsburg|奥格斯堡|city|10.90|48.37|Europe|
geneva|Geneva|日内瓦|city|6.14|46.20|Europe|
zurich|Zurich|苏黎世|city|8.54|47.38|Europe|
trent|Trent|特伦托|city|11.12|46.07|Europe|Trento
paris|Paris|巴黎|city|2.35|48.86|Europe|
versailles|Versailles|凡尔赛|city|2.12|48.80|Europe|
nantes|Nantes|南特|city|-1.55|47.22|Europe|
london|London|伦敦|city|-0.13|51.51|Europe|
liverpool|Liverpool|利物浦|city|-2.98|53.41|Europe|
amsterdam|Amsterdam|阿姆斯特丹|city|4.90|52.37|Europe|
utrecht|Utrecht|乌得勒支|city|5.12|52.09|Europe|
antwerp|Antwerp|安特卫普|city|4.40|51.22|Europe|
vienna|Vienna|维也纳|city|16.37|48.21|Europe|
prague|Prague|布拉格|city|14.42|50.08|Europe|
berlin|Berlin|柏林|city|13.40|52.52|Europe|
weimar|Weimar|魏玛|city|11.33|50.98|Europe|
munich|Munich|慕尼黑|city|11.58|48.14|Europe|
nuremberg|Nuremberg|纽伦堡|city|11.08|49.45|Europe|
waterloo|Waterloo|滑铁卢|city|4.40|50.71|Europe|
potsdam|Potsdam|波茨坦|city|13.06|52.40|Europe|
moscow|Moscow|莫斯科|city|37.62|55.75|Europe|
st-petersburg|St. Petersburg|圣彼得堡／彼得格勒|city|30.34|59.93|Europe|St Petersburg;Petersburg;Petrograd;Leningrad
constantinople|Constantinople / Istanbul|君士坦丁堡／伊斯坦布尔|city|28.98|41.01|Europe|Constantinople;Istanbul
sarajevo|Sarajevo|萨拉热窝|city|18.41|43.86|Europe|
yalta|Yalta|雅尔塔|city|34.16|44.50|Europe|
stalingrad|Stalingrad / Volgograd|斯大林格勒／伏尔加格勒|city|44.51|48.71|Europe|Stalingrad;Volgograd
brest|Brest-Litovsk|布列斯特-立托夫斯克|city|23.69|52.10|Europe|
suez|Suez|苏伊士|city|32.55|29.97|Africa|
bologna|Bologna|博洛尼亚|city|11.34|44.49|Europe|
venice|Venice|威尼斯|city|12.34|45.44|Europe|
granada|Granada|格拉纳达|city|-3.60|37.18|Europe|
tordesillas|Tordesillas|托尔德西里亚斯|city|-5.00|41.50|Europe|
marburg|Marburg|马尔堡|city|8.77|50.81|Europe|
avignon|Avignon|阿维尼翁|city|4.81|43.95|Europe|
quebec|Quebec|魁北克|city|-71.21|46.81|North America|
new-york|New York / New Amsterdam|纽约／新阿姆斯特丹|city|-74.01|40.71|North America|New York;New Amsterdam
jamestown|Jamestown|詹姆斯敦|city|-76.78|37.21|North America|
goa|Goa|果阿|region|74|15.4|Asia|
malacca|Malacca|马六甲|city|102.25|2.19|Asia|
tehran|Tehran|德黑兰|city|51.39|35.69|Asia|
helsinki|Helsinki|赫尔辛基|city|24.94|60.17|Europe|
maastricht|Maastricht|马斯特里赫特|city|5.69|50.85|Europe|
madrid|Madrid|马德里|city|-3.70|40.42|Europe|
chernobyl|Chernobyl|切尔诺贝利|city|30.10|51.28|Europe|
srebrenica|Srebrenica|斯雷布雷尼察|city|19.30|44.11|Europe|
dayton|Dayton|代顿|city|-84.19|39.76|North America|
dien-bien-phu|Dien Bien Phu|奠边府|city|103.02|21.39|Asia|
omdurman|Omdurman|恩图曼|city|32.48|15.65|Africa|
adwa|Adwa|阿杜瓦|city|38.90|14.16|Africa|
fashoda|Fashoda|法绍达|city|31.87|9.89|Africa|
isandlwana|Isandlwana|伊散德尔瓦纳|city|30.65|-28.36|Africa|
el-alamein|El Alamein|阿拉曼|city|28.95|30.83|Africa|
pearl-harbor|Pearl Harbor|珍珠港|city|-157.95|21.35|Oceania|
auschwitz|Auschwitz|奥斯维辛|city|19.18|50.03|Europe|
france|France|法国|region|2.5|46.5|Europe|
britain|Britain / United Kingdom|不列颠／英国|region|-2|54|Europe|Britain;Great Britain;United Kingdom;UK
england|England|英格兰|region|-1.5|52.5|Europe|
scotland|Scotland|苏格兰|region|-4|57|Europe|
ireland|Ireland|爱尔兰|region|-8|53|Europe|
spain|Spain|西班牙|region|-3.7|40.4|Europe|
portugal|Portugal|葡萄牙|region|-8|39.5|Europe|
netherlands|Netherlands / Dutch Republic|尼德兰／荷兰共和国|region|5.3|52.2|Europe|Netherlands;Dutch Republic
italy|Italy|意大利|region|12.5|43|Europe|
germany|Germany|德国|region|10.5|51|Europe|
prussia|Prussia|普鲁士|region|13.5|52.5|Europe|
austria|Austria|奥地利|region|14|47.5|Europe|
austria-hungary|Austria-Hungary|奥匈帝国|region|17|48|Europe|
poland|Poland|波兰|region|19|52|Europe|
hungary|Hungary|匈牙利|region|19|47|Europe|
russia|Russia|俄罗斯|region|38|56|Europe|
soviet-union|Soviet Union / USSR|苏联|region|38|56|Europe|Soviet Union;USSR
sweden|Sweden|瑞典|region|16|62|Europe|
denmark|Denmark|丹麦|region|10|56|Europe|
switzerland|Switzerland|瑞士|region|8|47|Europe|
belgium|Belgium|比利时|region|4.5|50.8|Europe|
greece|Greece|希腊|region|23|39|Europe|
serbia|Serbia|塞尔维亚|region|21|44|Europe|
bosnia|Bosnia / Bosnia-Herzegovina|波斯尼亚／波黑|region|18|44|Europe|Bosnia;Bosnia-Herzegovina
romania|Romania|罗马尼亚|region|25|46|Europe|
yugoslavia|Yugoslavia|南斯拉夫|region|20|44|Europe|
czechoslovakia|Czechoslovakia|捷克斯洛伐克|region|17|49|Europe|
slovenia|Slovenia|斯洛文尼亚|region|14.5|46|Europe|
croatia|Croatia|克罗地亚|region|16|45.5|Europe|
kosovo|Kosovo|科索沃|region|21|42.6|Europe|
ukraine|Ukraine|乌克兰|region|31|49|Europe|
turkey|Turkey|土耳其|region|35|39|Asia|
ottoman-empire|Ottoman Empire|奥斯曼帝国|region|29|40|Europe|Ottoman Empire;Ottomans
holy-roman-empire|Holy Roman Empire|神圣罗马帝国|region|11|50|Europe|
bohemia|Bohemia|波希米亚|region|14.5|50|Europe|
saxony|Saxony|萨克森|region|13|51|Europe|
bavaria|Bavaria|巴伐利亚|region|11.5|49|Europe|
silesia|Silesia|西里西亚|region|17|51|Europe|
westphalia|Westphalia|威斯特伐利亚|region|8|52|Europe|
alsace-lorraine|Alsace-Lorraine|阿尔萨斯-洛林|region|7|49|Europe|Alsace-Lorraine;Alsace;Lorraine
rhineland|Rhineland|莱茵兰|region|7|51|Europe|
ruhr|Ruhr|鲁尔|region|7.2|51.5|Europe|
sudetenland|Sudetenland|苏台德地区|region|13|50.5|Europe|
piedmont|Piedmont|皮埃蒙特|region|7.5|45|Europe|Piedmont;Piedmont-Sardinia
lombardy|Lombardy|伦巴第|region|9.5|45.5|Europe|
venetia|Venetia|威尼西亚|region|12|45.5|Europe|
two-sicilies|Two Sicilies|两西西里|region|14.5|39|Europe|
castile|Castile|卡斯蒂利亚|region|-4.5|41|Europe|
aragon|Aragon|阿拉贡|region|-0.5|42|Europe|
navarre|Navarre|纳瓦拉|region|-1.6|42.8|Europe|
catalonia|Catalonia|加泰罗尼亚|region|1.5|41.8|Europe|
crimea|Crimea|克里米亚|region|34|45|Europe|
balkans|Balkans|巴尔干|region|21|43|Europe|
baltic|Baltic|波罗的海地区|region|23|57|Europe|
east-germany|East Germany|东德|region|12.5|52|Europe|
west-germany|West Germany|西德|region|8|51|Europe|
europe|Europe|欧洲|region|15|50|Europe|
eastern-europe|Eastern Europe|东欧|region|25|51|Europe|
western-europe|Western Europe|西欧|region|5|49|Europe|
northwestern-europe|Northwestern Europe|西北欧|region|3|54|Europe|
mediterranean|Mediterranean|地中海地区|region|17|36|Europe|
rhine|Rhine|莱茵河流域|region|7.5|50|Europe|
western-front|Western Front|西线|region|4|50|Europe|
eastern-front|Eastern Front|东线|region|25|52|Europe|
marne|Marne|马恩河地区|region|3.5|49|Europe|
verdun|Verdun|凡尔登|city|5.38|49.16|Europe|
somme|Somme|索姆河地区|region|2.5|50|Europe|
tannenberg|Tannenberg|坦能堡|region|20.1|53.5|Europe|
gallipoli|Gallipoli|加里波利|region|26.4|40.2|Europe|
vichy|Vichy|维希|city|3.43|46.13|Europe|
guernica|Guernica|格尔尼卡|city|-2.68|43.32|Europe|
wartburg|Wartburg|瓦尔特堡|city|10.31|50.97|Europe|
kronstadt|Kronstadt|喀琅施塔得|city|29.77|60|Europe|
vatican|Vatican|梵蒂冈|city|12.45|41.90|Europe|
gibraltar|Gibraltar|直布罗陀|region|-5.35|36.14|Europe|
india|India|印度|region|78|22|Asia|
china|China|中国|region|105|35|Asia|
japan|Japan|日本|region|138|37|Asia|
vietnam|Vietnam|越南|region|106|16|Asia|
indonesia|Indonesia|印度尼西亚|region|117|-2|Asia|
palestine|Palestine|巴勒斯坦地区|region|35|32|Asia|
syria|Syria|叙利亚|region|38|35|Asia|
iraq|Iraq|伊拉克|region|44|33|Asia|
arabia|Arabia|阿拉伯半岛|region|45|24|Asia|
middle-east|Middle East|中东|region|40|32|Asia|
asia|Asia|亚洲|region|90|35|Asia|
spice-islands|Spice Islands|香料群岛|region|128|-3|Asia|
africa|Africa|非洲|region|20|5|Africa|
west-africa|West Africa|西非|region|-5|10|Africa|
north-africa|North Africa|北非|region|15|28|Africa|
egypt|Egypt|埃及|region|30|27|Africa|
algeria|Algeria|阿尔及利亚|region|3|28|Africa|
morocco|Morocco|摩洛哥|region|-7|32|Africa|
congo|Congo|刚果地区|region|23|-3|Africa|
ethiopia|Ethiopia|埃塞俄比亚|region|39|9|Africa|
liberia|Liberia|利比里亚|region|-10|6|Africa|
south-africa|South Africa|南非|region|25|-29|Africa|
cape-good-hope|Cape of Good Hope|好望角|region|18.5|-34.4|Africa|
americas|Americas / New World|美洲|region|-80|15|Americas|Americas;New World
north-america|North America|北美洲|region|-100|40|North America|
latin-america|Latin America|拉丁美洲|region|-65|-15|Americas|
united-states|United States|美国|region|-98|39|North America|United States;USA;U.S.
canada|Canada|加拿大|region|-100|56|North America|
brazil|Brazil|巴西|region|-52|-10|South America|
bolivia|Bolivia|玻利维亚|region|-64|-17|South America|
caribbean|Caribbean|加勒比地区|region|-72|18|North America|
haiti|Haiti / Saint-Domingue|海地／圣多明各|region|-72.5|19|North America|Haiti;Saint-Domingue
new-spain|New Spain|新西班牙|region|-100|22|North America|
atlantic|Atlantic|大西洋|region|-30|25|Atlantic|
pacific|Pacific|太平洋|region|-150|0|Pacific|
tahiti|Tahiti|塔希提|region|-149.4|-17.7|Oceania|
'''


def places():
    result = []
    for line in DEFINITIONS.strip().splitlines():
        pid, en, zh, kind, lon, lat, region, aliases = line.split('|')
        result.append(dict(id=pid, nameEn=en, nameZh=zh, kind=kind, lon=float(lon), lat=float(lat),
                           aliases=[a for a in aliases.split(';') if a], region=region,
                           noteZh=('近似城市学习锚点，不代表事件精确发生地点。' if kind == 'city' else
                                   '国家／历史地区／区域的代表性学习锚点，不表示疆界、主权或精确事件地点。') + ' 坐标由编者手工取整；原卡片中的历史名称保持不变。',
                           noteEn=('Approximate city learning anchor; not an exact event location. ' if kind == 'city' else
                                   'Representative country/historical-region/area learning anchor; not a border, sovereignty claim, or exact event location. ') + 'Coordinates manually rounded by the editor; original historical labels in cards are preserved.'))
    return result


def card_places(card, anchors):
    text = ' '.join(card[key]['en'] for key in ('title', 'summary', 'detail'))
    # Named people and institutional names alone do not establish a place reference.
    text = re.sub(r'\b(?:Florence Nightingale|(?:Dutch |English |British )?East India Company)\b', '', text)
    matches = []
    for p in anchors:
        for alias in [p['nameEn'], *p['aliases']]:
            for match in re.finditer(r'(?<![\w])' + re.escape(alias) + r'(?![\w])', text):
                matches.append((match.start(), match.end(), p['id']))
    # Prefer complete place phrases over component words: East Germany != Germany;
    # North Africa != Africa. Distinct references elsewhere in the card survive.
    chosen = [(a, b, pid) for a, b, pid in matches if not any(
        c <= a and d >= b and (c < a or d > b) for c, d, other in matches)]
    return sorted({pid for a, b, pid in chosen})


def project(lon, lat):
    return (lon + 180) * 1600 / 360, (90 - lat) * 800 / 180


def build_svg(path):
    raw = path.read_bytes()
    geo = json.loads(raw)
    colors = {'Europe': '#d9e5d4', 'Asia': '#e8dfc8', 'Africa': '#e9d4bf',
              'North America': '#d7e2e8', 'South America': '#e5d6d7',
              'Oceania': '#d8e5e1', 'Antarctica': '#e4e8e8', 'Seven seas (open ocean)': '#e4e8e8'}
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800" role="img" aria-label="World geography; modern outlines for orientation only">',
             '<title>Made with Natural Earth · geographic learning context</title>',
             '<desc>Public-domain Natural Earth 1:110m modern country outlines; not historical boundaries. Equirectangular projection. https://www.naturalearthdata.com/about/terms-of-use/</desc>',
             '<rect width="1600" height="800" fill="#edf3f3"/>',
             '<g stroke="#fffdf8" stroke-width=".65" stroke-linejoin="round" fill-rule="evenodd">']
    for f in geo['features']:
        geom = f['geometry']; props = f['properties']
        polygons = [geom['coordinates']] if geom['type'] == 'Polygon' else geom['coordinates']
        commands = []
        for polygon in polygons:
            for ring in polygon:
                points = [project(lon, lat) for lon, lat, *rest in ring]
                commands.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in points) + 'Z')
        continent = props['CONTINENT']
        parts.append(f'<path data-country="{html.escape(props["ADM0_A3"], quote=True)}" data-region="{html.escape(continent, quote=True)}" fill="{colors.get(continent, "#e4e8e8")}" d="{"".join(commands)}"><title>{html.escape(props["ADMIN"])}</title></path>')
    parts.extend(['</g>', '</svg>'])
    svg = '\n'.join(parts) + '\n'
    (ROOT / 'assets/world.svg').write_text(svg)
    metadata = dict(version=1, name='Natural Earth 1:110m Admin 0 Countries',
                    sourceUrl=SOURCE, license='Public domain', licenseUrl=TERMS,
                    attribution='Made with Natural Earth.', accessed='2026-10-28',
                    sourceSha256=hashlib.sha256(raw).hexdigest(),
                    featureCount=len(geo['features']), svgSha256=hashlib.sha256(svg.encode()).hexdigest(),
                    projection=dict(name='Equirectangular', width=1600, height=800,
                                    x='(longitude + 180) * 1600 / 360', y='(90 - latitude) * 800 / 180'),
                    processing='Coordinates rounded to 0.1 SVG units; original polygon rings retained; pastel continental fills.',
                    scopeNote='Modern country geometry supplies orientation only, not historical borders or sovereignty claims. Card coordinates are separate manually rounded learning markers, not derived event positions.')
    write_json('assets/geography-source.json', metadata)


def write_json(relative, value):
    (ROOT / relative).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--geojson', type=Path)
    args = parser.parse_args()
    anchors = places()
    cards = json.loads((ROOT / 'data/course.json').read_text())['cards']
    links = {card['id']: card_places(card, anchors) for card in cards}
    write_json('data/places.json', anchors)
    write_json('data/card-locations.json', dict(version=1, links=links, policy=(
        'Explicit English place-name matching in title, summary, and detail only; all distinct referenced places are retained. '
        'Longest overlapping place phrase wins. No demonym/adjective-only inference, person-name inference, event-origin inference, or first-match assignment. '
        'Place mentions identify study context, not proof that the described event occurred at the representative marker. '
        'Original historical names remain in course cards; country and historical-region coordinates are approximate representative learning anchors. '
        'Cards without a matching explicit name retain an empty array.')))
    if args.geojson:
        build_svg(args.geojson)
    print(f'{len(anchors)} anchors; {sum(bool(ids) for ids in links.values())}/{len(cards)} cards mapped; {sum(not ids for ids in links.values())} unmapped')


if __name__ == '__main__':
    main()
