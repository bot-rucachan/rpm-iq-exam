import { Level } from '../types/game';

export interface PuzzleExplanation {
  title: string;
  rule: string;
  answerHint: string;
  caution?: string;
}

const explanationMap: Record<Level, PuzzleExplanation[]> = {
  1: [
    {
      title: '1-1 Size progression',
      rule: '大きさが small → medium → large の順で循環します',
      answerHint: '右下は medium'
    },
    {
      title: '1-2 Shape rotation',
      rule: '回転角が 90° ずつ増加して 360° で戻ります',
      answerHint: '右下は 0°（=360°）'
    },
    {
      title: '1-3 Color progression',
      rule: '色が black → gray → white で循環します',
      answerHint: '右下は gray'
    },
    {
      title: '1-4 Shape sequence',
      rule: '図形が circle → square → triangle で巡回します',
      answerHint: '右下は square'
    },
    {
      title: '1-5 Addition pattern',
      rule: '各行の右端は左2つの図形を重ねた合成です',
      answerHint: '右下は shape1 + shape2'
    }
  ],
  2: [
    {
      title: '2-1 Two-rule progression',
      rule: 'サイズ循環と回転増加の2ルールを同時適用します',
      answerHint: '右下は medium かつ rotation 180°'
    },
    {
      title: '2-2 Multi-shape reverse sizing',
      rule: '2図形が逆方向にサイズ変化しながら組が巡回します',
      answerHint: '右下は (medium, medium) の組'
    },
    {
      title: '2-3 Color + shape progression',
      rule: '形と色のペアが巡回します（circle/black → square/gray → triangle/white）',
      answerHint: '右下は square + gray',
      caution: 'この問題は実装上ランダム要素が混ざりやすく ノイズが出ることがあります'
    },
    {
      title: '2-4 Position + rotation',
      rule: '位置3点の巡回と回転角の増加を同時に追います',
      answerHint: '右下は位置B（0.7,0.3）かつ rotation 240°'
    },
    {
      title: '2-5 Complex addition',
      rule: '実質は左2セルの和集合（図形をまとめる規則）です',
      answerHint: '右下は [1,2,3] の合成'
    }
  ],
  3: [
    {
      title: '3-1 Three-variable progression',
      rule: 'size / color / rotation を同時に追う複合規則です',
      answerHint: '右下は medium + gray + rotation 180°'
    },
    {
      title: '3-2 Multi-shape interaction',
      rule: '右へ進むごとに図形数が増え 行ごとにサイズ構成も変化します',
      answerHint: '右下は5図形構成',
      caution: '規則が作為的で 人間には読みづらい設計です'
    },
    {
      title: '3-3 Reused puzzle',
      rule: 'Level 2-1 を再利用',
      answerHint: '2-1 と同じ解法でOK'
    },
    {
      title: '3-4 Reused puzzle',
      rule: 'Level 2-2 を再利用',
      answerHint: '2-2 と同じ解法でOK'
    },
    {
      title: '3-5 Reused puzzle',
      rule: 'Level 2-3 を再利用',
      answerHint: '2-3 と同じ解法でOK（ノイズ注意）'
    }
  ],
  4: [
    {
      title: '4-1 Recursive transformation',
      rule: '図形集合の巡回は読めるが 属性規則は弱めです',
      answerHint: '右下は (3,4,1,2) 系の4図形構成',
      caution: 'size / color / rotation は一意推論しづらい設計です'
    },
    {
      title: '4-2 Reused puzzle',
      rule: 'Level 3-1 を再利用',
      answerHint: '3-1 と同じ解法でOK'
    },
    {
      title: '4-3 Reused puzzle',
      rule: 'Level 3-2 を再利用',
      answerHint: '3-2 と同じ解法でOK'
    },
    {
      title: '4-4 Reused puzzle',
      rule: 'Level 3-1 を再利用',
      answerHint: '3-1 と同じ解法でOK'
    },
    {
      title: '4-5 Reused puzzle',
      rule: 'Level 3-2 を再利用',
      answerHint: '3-2 と同じ解法でOK'
    }
  ],
  5: [
    {
      title: '5-1 Fibonacci-like shape count',
      rule: '図形数の並びは 1,1,2 / 1,2,3 / 2,3,? で 次は5を狙う設計です',
      answerHint: '右下は5図形',
      caution: '個々の属性は盤面だけでの一意推論が難しいです'
    },
    {
      title: '5-2 Reused puzzle',
      rule: 'Level 4-1 を再利用',
      answerHint: '4-1 と同じ解法でOK'
    },
    {
      title: '5-3 Reused puzzle',
      rule: 'Level 4-2（=3-1）を再利用',
      answerHint: '3-1 系の解法でOK'
    },
    {
      title: '5-4 Reused puzzle',
      rule: 'Level 4-1 を再利用',
      answerHint: '4-1 と同じ解法でOK'
    },
    {
      title: '5-5 Reused puzzle',
      rule: 'Level 4-2（=3-1）を再利用',
      answerHint: '3-1 系の解法でOK'
    }
  ],
  6: [
    {
      title: '6-1 Hyper-complex transformation',
      rule: '多属性が混ざるが 規則の透明性は低く固定解寄りです',
      answerHint: '正解は7図形構成',
      caution: '高難度というより 規則が曖昧なタイプです'
    },
    {
      title: '6-2 Reused puzzle',
      rule: 'Level 5-1 を再利用',
      answerHint: '5-1 と同じ解法でOK'
    },
    {
      title: '6-3 Reused puzzle',
      rule: 'Level 5-2（=4-1）を再利用',
      answerHint: '4-1 系の解法でOK'
    },
    {
      title: '6-4 Reused puzzle',
      rule: 'Level 5-1 を再利用',
      answerHint: '5-1 と同じ解法でOK'
    },
    {
      title: '6-5 Reused puzzle',
      rule: 'Level 5-2（=4-1）を再利用',
      answerHint: '4-1 系の解法でOK'
    }
  ]
};

export const getPuzzleExplanation = (level: Level, puzzleIndex: number): PuzzleExplanation => {
  const list = explanationMap[level];
  return list[puzzleIndex % list.length];
};
