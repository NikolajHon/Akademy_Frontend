// src/app/test/block.model.ts
export type BlockType = 'paragraph' | 'code' | 'list' | 'section' | 'table';

export interface Block {
  id: string;
  type: BlockType;

  /**
   * paragraph → string
   * code      → { code: string; language: string }
   * list      → { ordered: boolean }
   * section   → { title: string }
   * table     → { rows: number; cols: number }
   */
  data: any;

  /** дочерние блоки (list / section / ячейки таблицы) */
  children?: Block[];

  /** двумерная матрица ячеек (только для table) */
  table?: Block[][];
}
