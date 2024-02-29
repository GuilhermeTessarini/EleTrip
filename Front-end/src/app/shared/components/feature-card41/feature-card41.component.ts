import { Component, Input } from '@angular/core'

@Component({
  selector: 'feature-card41',
  templateUrl: 'feature-card41.component.html',
  styleUrls: ['feature-card41.component.css'],
})
export class FeatureCard41 {
  @Input()
  title: string = 'Lorem ipsum'
  @Input()
  rootClassName: string = ''
  @Input()
  description: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lorem lorem, malesuada in metus vitae, scelerisque accumsan ipsum.'
  constructor() {}
}
