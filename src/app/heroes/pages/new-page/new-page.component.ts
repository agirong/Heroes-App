import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/hero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

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
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
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
          this.showSnackBar(`${ hero.superhero } actualizado!`);
        })
      return;
    }

    //Si no Crear...
    this.herosService.addHero(this.currenHero)
      .subscribe(hero=>{
        this.router.navigate(['/heroes/edit', hero.id ]);
        this.showSnackBar(`${ hero.superhero } creado!`);
      })

    //  this.herosService.updateHero(this.heroForm.value);

  }

  onDeleteHero(){
    if(!this.currenHero.id) throw Error('Hero id es requerido')

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.heroForm.value
      });

      dialogRef.afterClosed().subscribe(result => {
        if(!result) return;

        this.herosService.deleteHero(this.currenHero.id)
        .subscribe(wasDeleted=>{
          if(wasDeleted)
            this.router.navigate(['/heroes'])
        })
      });
  }

  showSnackBar(message:string){
    this.snackbar.open(message,'done',{
      duration:2500
    })
  }
}
