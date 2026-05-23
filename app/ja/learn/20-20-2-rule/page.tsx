import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

const meta = {
  title: '20-20-2ルール: 屋外時間が子供の近視を遅らせる仕組み',
  description:
    '20-20-2ルールは小児向けの20-20-20拡張版。子供の近視進行に対抗するため、1日2時間の屋外時間を加えます。エビデンスと、学校生活への組み込み方を解説。',
  slug: '20-20-2-rule',
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
        子供の近視 (近視眼) は世界的に増加しています。一部の予測では2050年までに世界人口の
        半数が近視になるとされています。スクリーンが悪者扱いされますが、最も研究されている
        保護要因はスクリーンルールではなく — <strong>日光</strong>です。
      </p>
      <p>
        <strong>20-20-2ルール</strong>は小児眼科コミュニティの答え: 通常の20-20-20
        スクリーン休憩プロトコルに、1日2時間の屋外時間を重ねます。
      </p>

      <h2>「2」は何を意味するか？</h2>
      <p>
        <strong>毎日2時間の屋外時間。</strong>週1回スポーツ練習で2時間ではなく、
        持続的・毎日・家の外、できれば日光の下で。
      </p>
      <p>
        活動強度は重要ではありません。学校までの徒歩通学、外でのランチ、ポーチでの読書、
        庭での遊び — すべてカウント。能動成分は目への日光曝露です。
      </p>

      <h2>なぜ屋外時間が視力に重要か</h2>
      <ul>
        <li>
          <strong>網膜内ドーパミン放出。</strong>明るい屋外光は網膜のドーパミン放出を刺激し、
          眼球の伸長 (近視が進行する物理的変化) を遅らせるようです。
        </li>
        <li>
          <strong>遠距離焦点。</strong>屋外では遠距離視野が自然に多くなる。屋内ではほぼ
          すべてが6m以内 — 近距離焦点ゾーン。
        </li>
        <li>
          <strong>高い光強度。</strong>曇った屋外でも、よく照明された室内より5〜10倍明るい。
        </li>
      </ul>

      <h2>エビデンスが示すこと</h2>
      <p>
        複数のコホート研究と少数のランダム化試験で、子供の毎日の屋外時間を増やすと
        新規近視発症が約30〜50%減少することが示されています。最大の効果サイズは
        台湾、シンガポール、オーストラリアでの大規模な学校向け屋外時間介入から
        得られています。
      </p>
      <p>
        近視がすでに発症した後でも、屋外時間はそれ以上の進行を遅らせますが、回復はさせません。
        早ければ早いほど良い。
      </p>

      <h2>実際の1週間での20-20-2</h2>
      <p>1日2時間の目標は学校週では思ったより難しい。効く戦略:</p>
      <ul>
        <li>
          <strong>通学とまとめる。</strong>登下校の徒歩・自転車だけで30〜60分カバー
          できることが多い。
        </li>
        <li>
          <strong>屋外ランチ＋休み時間。</strong>多くの学校に屋外ランチエリアがある;
          休み時間を年中屋外にするよう働きかける。
        </li>
        <li>
          <strong>1日1つ屋内活動を屋外化。</strong>ポーチで読書、近所を歩きながら友達と電話、
          公園のベンチで宿題。
        </li>
        <li>
          <strong>週末をデフォルト屋外に。</strong>平日が60〜90分しか取れなくても、
          土日に3〜4時間貯めれば週平均が上がる。
        </li>
        <li>
          <strong>20-20-20タイマーと組み合わせる。</strong>屋内スクリーン時間は依然として
          標準休憩プロトコルから恩恵を受ける — そのセッションには無料の
          <a href="/ja">EYE CAREタイマー</a>を使用。
        </li>
      </ul>

      <h2>UV曝露はどうか？</h2>
      <p>
        日光が能動成分ですが、UV保護も重要。長時間の屋外時間ではUV400保護のサングラスが
        推奨されます (特に夏の正午頃)。色付きレンズでもドーパミン経路を起動するには十分な
        光を通す — 保護効果のために裸眼で太陽を直視する必要はありません。
      </p>

      <h2>親へ: 現実的な目標</h2>
      <p>
        完璧な1日2時間を目指すと挫折するセットアップ。<strong>現状より方向性として多く</strong>
        を狙う。お子さんが現状1日30分屋外なら、60分への倍増は意味がある。すでに90分なら、
        2時間以上を一貫して達成するのがゴールド・スタンダード。
      </p>
      <p>
        年1回の総合眼科検査と屋内スクリーン時間の20-20-20ルールと組み合わせれば、
        利用可能な最高エビデンスのレバーをカバーしたことになります。関連:
        <a href="/ja/learn/20-20-20-rule-for-kids">子供のための20-20-20ルール</a>と、
        <a href="/ja/learn/does-the-20-20-20-rule-work">20-20-20が本当に効くかの研究</a>。
      </p>
    </ArticleLayout>
  );
}
