import { Component, OnInit } from '@angular/core';
import { ProspectosService } from 'src/app/services/prospectos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prospectos',
  templateUrl: './prospectos.component.html',
  styleUrls: ['./prospectos.component.scss']
})
export class ProspectosComponent implements OnInit {

  prospectos:Prospecto[] = []

  constructor(private prospectosService: ProspectosService, private router: Router) { }

  ngOnInit(): void {
    this.getProspectos()
  }

  getProspectos(){
    this.prospectosService.query().subscribe((resp:any)=>{
      console.log("QUERY", resp);
      this.prospectos = resp
    })


    // this.prospectosService.read(1).subscribe((resp:any)=>{
    //   console.log("READ", resp);
    // })
  }

  goDetail(prospectoId:number){
    this.router.navigate(['/prospectos-detalle',prospectoId])
  }

  nuevo(){
    this.router.navigate(['/prospectos-detalle'])
  }

  goEvaluate(prospectoId:number){
    this.router.navigate(['/prospectos','value',prospectoId])
  }
}


interface Prospecto{
  apMaterno: string
  apPaterno: string
  authorization: string
  calle: string
  colonia: string
  cp: string
  nombre: string
  numero: string
  prospectoId: number
  rfc: string
  stAutorization: number
  telefono: string
}
