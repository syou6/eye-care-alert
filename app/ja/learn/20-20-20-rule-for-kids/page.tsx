import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

const meta = {
  title: '子供のための20-20-20ルール — 親が知っておくべき画面時間と目の健康',
  description:
    '子供のスクリーン時間が史上最長になった今、20-20-20ルール (および子供向け拡張の20-20-2ルール) は近視進行を遅らせ、デジタル眼精疲労から幼い目を守ります。',
  slug: '20-20-20-rule-for-kids',
  publishedAt: '2026-05-23',
  readingMinutes: 6,
};

export const metadata: Metadata = {
  title: `${meta.title} | EYE CARE`,
  description: meta.description,
  alternates: {
    canonical: `https://eyecare.love/ja/learn/${meta.slug}`,
    languages: {
      en: `https://eyecare.love/learn/${meta.slug}`,
      ja: `https://eyecare.love/ja/learn/${meta.slug}`,
      'x-default': `https://eyecare.love/learn/${meta.slug}`,
    },
  },
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: `https://eyecare.love/ja/learn/${meta.slug}`,
    type: 'article',
    locale: 'ja_JP',
  },
};

export default function Page() {
  return (
    <ArticleLayout meta={meta} lang="ja">
      <p>
        お子さんが毎日タブレット・ノートパソコン・Chromebookを何時間も使っているなら、
        その心配は正しいです。小児眼科医はスクリーン関連の眼精疲労の急増と、世代全体の
        近視進行の加速を警告しています。良いニュース: シンプルでエビデンスに基づいた習慣で
        実際に差を作れます。
      </p>

      <h2>20-20-20ルールとは？</h2>
      <p>
        1990年代にカリフォルニア州の検眼医ジェフリー・アンシェル博士が提唱したルールで、
        <strong>20分ごとに、6メートル (20フィート) 以上離れたものを20秒間見る</strong>
        というものです。アメリカ検眼協会 (AOA) はデジタルスクリーンを使う人の基本習慣として
        長年推奨してきました。
      </p>
      <p>
        このルールが効く理由は、遠くを見ることで目の中の毛様体筋がリラックスするから。
        20分間連続で近距離に焦点を合わせていると、その筋肉が疲労します — 多くの子供が
        「目が痛い」と訴える原因です。
      </p>

      <h2>なぜ大人より子供にこそ必要か</h2>
      <ul>
        <li>
          <strong>目はまだ発達途中。</strong>12歳頃まで眼球は実際に伸び続けています。
          この時期に長時間の近距離注視を続けることは、近視進行の最も強い既知のリスク要因の
          一つです。
        </li>
        <li>
          <strong>瞬きが減る。</strong>大人は1分間に約15回瞬きしますが、動画やゲームに
          没頭している子供は4〜5回まで減ります。涙の膜が乾き角膜が刺激されます。
        </li>
        <li>
          <strong>自分から訴えない。</strong>子供は「焦点距離が近すぎて目が痛い」とは
          言いません。機嫌が悪くなる、目をこする、集中力が途切れる、として現れます。
        </li>
      </ul>

      <h2>実際に習慣化する方法</h2>
      <p>
        集中している8歳児に「20分ごとに目を離して」と言うだけでは続きません。実践的なコツ:
      </p>
      <ol>
        <li>
          <strong>見えるタイマーを使う。</strong>抽象的なルールより、視覚的なカウントダウンが
          はるかに効果的。無料の<a href="/ja">20-20-20タイマー</a>がリズムを管理し、
          20秒の休憩オーバーレイを自動表示します。
        </li>
        <li>
          <strong>具体的に何を見るか指示する。</strong>「窓の外を見て鳥を3羽数えて」の方が
          「遠くを見て」より効きます。
        </li>
        <li>
          <strong>姿勢リセットと組み合わせる。</strong>20秒の間に立ち上がる、伸びをする、
          3回深呼吸する。猫背問題も同時に解決できます。
        </li>
      </ol>

      <h2>アップグレード版: 20-20-2ルール</h2>
      <p>
        学童期の子供に対して、主要な小児眼科学団体は今や追加のルールを推奨しています:
        <strong>毎日少なくとも2時間の屋外時間。</strong>太陽光曝露は子供の近視進行を
        遅らせるエビデンスがある数少ない介入の一つです。20-20-20ルールは短期の眼精疲労を
        管理し、「2」が長期的な視覚発達を守ります。
        <a href="/ja/learn/20-20-2-rule">20-20-2ルールの詳細</a>
        と、学校生活への組み込み方の解説もあります。
      </p>

      <h2>スクリーン時間が子供の目を傷つけているサイン</h2>
      <ul>
        <li>学校で黒板やテレビを見るとき目を細める</li>
        <li>宿題やゲームの後に目をこする</li>
        <li>夕方〜夜に頭痛が出る</li>
        <li>デバイスを顔にどんどん近づける</li>
        <li>読書や書く宿題を避ける</li>
      </ul>
      <p>
        どれか一つでも当てはまれば — Google検索ではなく — 小児眼科の受診を。早期介入
        (適切な眼鏡、近視管理プラン、スクリーン習慣の改善) が将来の大きな問題を防ぎます。
      </p>

      <h2>現実的な1日のプラン</h2>
      <ul>
        <li><strong>宿題・iPad時間:</strong> 画面の隅で20-20-20タイマー稼働</li>
        <li><strong>放課後:</strong> 2時間屋外 (天気が許す限り)</li>
        <li><strong>就寝前:</strong> 寝る30分前にスクリーンOFF</li>
        <li><strong>年1回:</strong> 学校の視力検査ではなく総合眼科検査</li>
      </ul>
      <p>
        20-20-20ルールは魔法ではありません。屋外時間と定期的な眼科検査と組み合わせて
        初めて、スクリーンだらけの世界でお子さんの目が健全に発達する最高の機会を与えられます。
      </p>
    </ArticleLayout>
  );
}
