import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Block, BlockType } from './block.model';
import { v4 as uuid } from 'uuid';

/**
 * Глобальная карта разрешённых дочерних блоков.
 * section → любые, но саму section можно убрать, если не нужны вложенные секции.
 */
const ALLOWED: Record<BlockType, BlockType[]> = {
  paragraph: [],
  code:      [],
  list:      ['paragraph'],
  table:     ['paragraph', 'code', 'list'],
  section:   ['paragraph', 'code', 'list', 'table', 'section']
};

@Injectable({ providedIn: 'root' })
export class BlockService {
  private blocksSub = new BehaviorSubject<Block[]>([]);
  readonly blocks$  = this.blocksSub.asObservable();

  private get blocks() { return this.blocksSub.value; }
  private emit(b: Block[]) { this.blocksSub.next(b); }

  /* ───────────────── helpers ───────────────── */

  private makeBlock(type: BlockType): Block {
    const id = uuid();
    switch (type) {
      case 'paragraph': return { id, type, data: '' };
      case 'code':      return { id, type, data: { code: '', language: 'plaintext' } };
      case 'list':      return { id, type, data: { ordered: false },               children: [] };
      case 'section':   return { id, type, data: { title: 'New section' },         children: [] };
      case 'table':
        const cell = () => this.makeBlock('paragraph');
        return {
          id, type,
          data:  { rows: 2, cols: 2 },
          table: [ [cell(), cell()], [cell(), cell()] ]
        };
    }
  }

  /* рекурсивный маппер: применяем fn к каждому блоку в дереве */
  private mapRecursive(blocks: Block[], fn: (b: Block) => void): Block[] {
    return blocks.map(orig => {
      const b: Block = { ...orig };
      fn(b);
      if (b.children) b.children = this.mapRecursive(b.children, fn);
      if (b.table) {
        b.table = b.table.map(row =>
          row.map(cell => {
            const c = { ...cell };
            fn(c);
            if (c.children) c.children = this.mapRecursive(c.children, fn);
            return c;
          })
        );
      }
      return b;
    });
  }

  /* фильтр дерева — удалить блок (используется в removeBlock) */
  private filterRecursive(blocks: Block[], id: string): Block[] {
    return blocks
      .filter(b => b.id !== id)
      .map(b => ({
        ...b,
        children: b.children ? this.filterRecursive(b.children, id) : undefined,
        table:    b.table    ? b.table.map(r => this.filterRecursive(r, id)) : undefined
      }));
  }

  /* ───────────────── public API ───────────────── */

  /** Добавляем блок на КОРНЕВОЙ уровень (toolbar сверху) */
  addBlock(type: BlockType) {
    if (type !== 'section') {
      console.warn('На корневом уровне разрешено только Section');
      return;
    }
    this.emit([...this.blocks, this.makeBlock(type)]);
  }

  /** Добавляем дочерний блок к parentId с учётом карты ALLOWED */
  addChildBlock(parentId: string, type: BlockType) {
    const child = this.makeBlock(type);

    this.emit(this.mapRecursive(this.blocks, b => {
      if (b.id !== parentId) return;

      // ① Проверяем, разрешён ли такой тип потомка
      if (!ALLOWED[b.type].includes(type)) {
        console.warn(`${type} нельзя поместить внутрь ${b.type}`);
        return;
      }

      // ② Если у блока уже есть children — добавляем туда
      if (b.children) {
        b.children = [...b.children, child];
        return;
      }

      // ③ Таблица — помещаем в левую‑верхнюю ячейку, если она пустая
      if (b.table) {
        const firstCell = b.table[0][0];
        firstCell.children = firstCell.children ? [...firstCell.children, child] : [child];
        return;
      }

      // ④ Иначе просто создаём массив children
      b.children = [child];
    }));
  }

  /* ── стандартные методы без изменений ── */
  removeBlock(id: string)             { this.emit(this.filterRecursive(this.blocks, id)); }
  moveUp(index: number)               { if (index>0){ const a=[ ...this.blocks ]; [a[index-1],a[index]]=[a[index],a[index-1]]; this.emit(a);} }
  moveDown(index: number)             { if (index<this.blocks.length-1){ const a=[ ...this.blocks ]; [a[index+1],a[index]]=[a[index],a[index+1]]; this.emit(a);} }
  updateBlockData(id: string, data: any){ this.emit(this.mapRecursive(this.blocks,b=>{ if(b.id===id) b.data=data;})); }

  /* ── таблица ── */
  addTableRow(tableId: string) {
    this.emit(this.mapRecursive(this.blocks,b=>{
      if(b.id===tableId && b.table){
        const cols = b.data.cols;
        const row  = Array.from({length: cols}, () => this.makeBlock('paragraph'));
        b.table    = [ ...b.table, row ];
        b.data.rows++;
      }
    }));
  }
  addTableCol(tableId: string) {
    this.emit(this.mapRecursive(this.blocks,b=>{
      if(b.id===tableId && b.table){
        b.table = b.table.map(r => [ ...r, this.makeBlock('paragraph') ]);
        b.data.cols++;
      }
    }));
  }
  removeTableRow(tableId: string, rowIdx: number) {
    this.emit(this.mapRecursive(this.blocks,b=>{
      if(b.id===tableId && b.table && b.table.length>1){
        b.table.splice(rowIdx,1);
        b.data.rows--;
      }
    }));
  }
  removeTableCol(tableId: string, colIdx: number) {
    this.emit(this.mapRecursive(this.blocks,b=>{
      if(b.id===tableId && b.table && b.data.cols>1){
        b.table.forEach(r => r.splice(colIdx,1));
        b.data.cols--;
      }
    }));
  }

  /* сериализация — пока в консоль */
  save() { console.log('💾 LESSON →', JSON.stringify(this.blocks, null, 2)); }
}
