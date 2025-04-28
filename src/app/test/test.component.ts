import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { Observable }   from 'rxjs';

import { BlockService } from './block.service';
import { Block, BlockType } from './block.model';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  /** Корневой тулбар: можно создавать ТОЛЬКО секции */
  rootTypes: BlockType[]   = ['section'];
  /** Внутри секции (и в других контейнерах) можно создавать любые блоки, кроме section */
  childTypes: BlockType[]  = ['paragraph', 'code', 'list', 'table'];

  blocks$!: Observable<Block[]>;

  constructor(public bs: BlockService) {}

  ngOnInit() { this.blocks$ = this.bs.blocks$; }

  /* ————————————————— wrappers for template ————————————————— */
  trackById = (_: number, b: Block) => b.id;

  addBlock  = (t: BlockType)                => this.bs.addBlock(t);
  addChild  = (id: string, t: BlockType)    => this.bs.addChildBlock(id, t);
  remove    = (id: string)                  => this.bs.removeBlock(id);
  moveUp    = (i: number)                   => this.bs.moveUp(i);
  moveDown  = (i: number)                   => this.bs.moveDown(i);
  save      = ()                            => this.bs.save();
  updateData = (id: string, d: any)         => this.bs.updateBlockData(id, d);

  addRow    = (id: string)                  => this.bs.addTableRow(id);
  addCol    = (id: string)                  => this.bs.addTableCol(id);
  delRow    = (id: string, idx: number)     => this.bs.removeTableRow(id, idx);
  delCol    = (id: string, idx: number)     => this.bs.removeTableCol(id, idx);
}
