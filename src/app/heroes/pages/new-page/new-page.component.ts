import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/hero.service';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent {

  public heroForm = new FormGroup({
      id:               new FormControl<string>(''),
      superhero:        new FormControl<string>('',{nonNullable:true}),
      publisher:        new FormControl<Publisher>(Publisher.DCComics),
      alter_ego:        new FormControl(''),
      first_appearance: new FormControl(''),
      characters:       new FormControl(''),
      alt_img:          new FormControl(''),
  });

  public plublishers = [
    {id:'DC Comics', desc:'DC - Comics'},
    {id:'Marvel Comics', desc:'Marvel - Comics'},
  ];

  constructor(private herosService:HeroesService){}

  get currenHero():Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit():void{
    if(this.heroForm.invalid) return;

    //Si hay un currentHero Actualizar
    if(this.currenHero.id){
      this.herosService.updateHero(this.currenHero)
        .subscribe( hero =>{

        })
      return;
    }

    //Si no Crear...
    this.herosService.addHero(this.currenHero)
      .subscribe(hero=>{

      })

    //  this.herosService.updateHero(this.heroForm.value);

  }
}
