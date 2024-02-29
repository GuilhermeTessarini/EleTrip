import { Component, Input } from '@angular/core'

@Component({
  selector: 'gallery-card',
  templateUrl: 'gallery-card.component.html',
  styleUrls: ['gallery-card.component.css'],
})
export class GalleryCard {

  @Input()
  image_alt: string = 'image'
  @Input()
  image_src: string = 'imagemVeiculo'
  @Input()
  marcaVeiculo: string = 'marcaVeiculo'
  @Input()
  nomeVeiculo: string = 'NomeVeiculo'
  @Input()
  anoVeiculo: string = 'anoVeiculo'
  @Input()
  autonomiaVeiculo: string = 'autonomiaVeiculo'
  @Input()
  motorVeiculo: string = 'motorVeiculo'
  @Input()
  valorLocacao: string = 'valorLocacao'
  @Input()
  rootClassName: string = ''

  constructor() { }

  getFormattedImagePath(): string {
    const formattedPath = this.image_src.replace(/\\/g, '/');

    return formattedPath.includes('/assets/Upload-Images/')
      ? formattedPath
      : '/assets/Upload-Images/' + formattedPath;
  }
}
