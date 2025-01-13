import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/hero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

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

  constructor(
    private herosService:HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ){}

  ngOnInit(): void {
    //Si url no contiene edit salir.
    if(!this.router.url.includes('edit')) return;

    //url si contiene edit
    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.herosService.getHeroById(id))
    ).subscribe(hero=>{
      if(!hero){
        return this.router.navigateByUrl('/');
      }
      //cargar los datos al formulario
      this.heroForm.reset(hero);
      return;
    })
  }

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
