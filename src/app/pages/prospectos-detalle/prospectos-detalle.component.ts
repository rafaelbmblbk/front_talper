import { Component, OnInit } from '@angular/core';
import { ProspectosService } from 'src/app/services/prospectos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ArchivosService } from 'src/app/services/archivos.service';

@Component({
  selector: 'app-prospectos-detalle',
  templateUrl: './prospectos-detalle.component.html',
  styleUrls: ['./prospectos-detalle.component.scss']
})
export class ProspectosDetalleComponent implements OnInit {

  prospectoForm:FormGroup;
  prospectoId:number = 0
  btnSubmit:boolean = false;
  estatus:any[]=[
    {id: 1, descripcion: 'Enviado' },
    {id: 2, descripcion: 'Autorizado' },
    {id: 3, descripcion: 'Rechazado' },
  ]
  estatusProspecto:number = 0
  fromDisable:boolean=false
  authorization:boolean = false
  hideform: boolean = false
  addFile:any[]=[{id: new Date().getMilliseconds}]
  archivos:any[]=[]

  constructor(private prospectosService: ProspectosService, 
              private router: Router, 
              private route: ActivatedRoute,
              private formBuilder: FormBuilder, 
              private archivosService: ArchivosService) { 
    route.params.subscribe(parametros => {  
      console.log(parametros);         

      if(parametros["id"] != undefined){
        this.prospectoId = parametros["id"]
        this.fromDisable = true
      }

      if(parametros["valuar"] != undefined){
        this.authorization = true
      }else{
        this.hideform = true
      } 
      
    })

    console.log("authorization",this.authorization);
    console.log("fromDisable",this.fromDisable);
    
    this.prospectoForm = this.formBuilder.group({
      nombre:         [{value: null , disabled: this.fromDisable},[Validators.required]],
      apMaterno:      [{value: null , disabled: this.fromDisable},[Validators.required]],
      apPaterno:      [{value: null , disabled: this.fromDisable},[Validators.required]],
      calle:          [{value: null , disabled: this.fromDisable},[Validators.required]],
      numero:         [{value: null , disabled: this.fromDisable},[Validators.required]],
      colonia:        [{value: null , disabled: this.fromDisable},[Validators.required]],
      cp:             [{value: null , disabled: this.fromDisable},[Validators.required]],
      telefono:       [{value: null , disabled: this.fromDisable},[Validators.required]],
      rfc:            [{value: null , disabled: this.fromDisable},[Validators.required,Validators.pattern(/^([a-zA-Z&]{3,4})(-{0,1})(\d\d)(0[1-9]|1[012])(0[1-9]|[12]\d|30|31)(-{0,1})([a-zA-Z\w]{3})$/)]],
      authorization:  [{value: null , disabled: !this.fromDisable},[]],
      stAutorization: [{value: null , disabled: !this.fromDisable},[]],
      prospectoId:    [{value: null , disabled: this.fromDisable},[]],
      fullDireccion:  [{value: null , disabled: this.fromDisable},[]],
      motivo:         [{value: null , disabled: !this.fromDisable},[]],
    });
  }

  ngOnInit(): void {
    if(this.prospectoId != 0) this.getProspecto(this.prospectoId)
  }

  getProspecto(prospectoId:number){
    this.prospectosService.read(prospectoId).subscribe((resp:any)=>{
      console.log("READ", resp);
      let pr:Prospecto = resp[0]      
      let fullDireccion: string = `calle: ${pr.calle} No. ${pr.numero} Col. ${pr.colonia} C.P. ${pr.cp}`
      pr.fullDireccion = fullDireccion
      this.estatusProspecto = pr.stAutorization
      this.loadForms(pr)
    })

    this.archivosService.read(prospectoId).subscribe((data:any)=>{
      this.archivos = data
    })

  }

  estatusbd:boolean = false
  loadForms(pr:Prospecto){
    this.prospectoForm.setValue({
      nombre:         pr.nombre,
      apMaterno:      pr.apMaterno,
      apPaterno:      pr.apPaterno,
      calle:          pr.calle,
      numero:         pr.numero,
      colonia:        pr.colonia,
      cp:             pr.cp,
      telefono:       pr.telefono,
      rfc:            pr.rfc,
      authorization:  pr.authorization,
      stAutorization: pr.stAutorization,
      prospectoId:    pr.prospectoId,
      fullDireccion:  pr.fullDireccion,
      motivo:         pr.motivo
    });

    if(pr.stAutorization == 3) this.estatusbd = true

    let disabled: boolean = false
    
    if(this.prospectoId != 0) disabled = true
    if(this.authorization) disabled = false

    if(this.authorization || this.prospectoId != 0){
      this.hideform = false
      this.prospectoForm = this.formBuilder.group({
        nombre:         [{value: pr.nombre , disabled: this.fromDisable},[Validators.required]],
        apMaterno:      [{value: pr.apMaterno , disabled: this.fromDisable},[Validators.required]],
        apPaterno:      [{value: pr.apPaterno , disabled: this.fromDisable},[Validators.required]],
        calle:          [{value: pr.calle , disabled: this.fromDisable},[Validators.required]],
        numero:         [{value: pr.numero , disabled: this.fromDisable},[Validators.required]],
        colonia:        [{value: pr.colonia , disabled: this.fromDisable},[Validators.required]],
        cp:             [{value: pr.cp , disabled: this.fromDisable},[Validators.required]],
        telefono:       [{value: pr.telefono , disabled: this.fromDisable},[Validators.required]],
        rfc:            [{value: pr.rfc , disabled: this.fromDisable},[Validators.required,Validators.pattern(/^([a-zA-Z&]{3,4})(-{0,1})(\d\d)(0[1-9]|1[012])(0[1-9]|[12]\d|30|31)(-{0,1})([a-zA-Z\w]{3})$/)]],
        authorization:  [{value: pr.authorization , disabled: disabled},[]],
        stAutorization: [{value: pr.stAutorization , disabled: disabled},[]],
        prospectoId:    [{value: pr.prospectoId , disabled: this.fromDisable},[]],
        fullDireccion:  [{value: pr.fullDireccion , disabled: this.fromDisable},[]],
        motivo:         [{value: pr.motivo , disabled: disabled},[]],
      });

      setTimeout(() => {
        this.hideform = true
      }, 5);      
    }

  }

  get frm() { return this.prospectoForm.controls; }

  onSumbit(){
    this.btnSubmit = true
    if(this.prospectoForm.invalid) return;
    if(this.files.length <= 0 ) return

    console.log("FORM",this.prospectoForm.value);

    this.prospectosService.insert(this.prospectoForm.value).subscribe(async (data:any)=>{
      console.log("prospectosService.insert",data);
      let idProspecto: number = await data
      if(idProspecto != 0){
        let loadFiles = await this.loadArchivos(idProspecto)
        if(loadFiles == true){
          swal.fire({
            icon: 'success',
            title: 'Registro Guardado',
            confirmButtonColor: '#3085d6'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/prospectos'])
            }
          })
        }else{
          swal.fire({
            icon: 'error',
            title: 'Error al cargar archivos',
            text: 'Ocurrio un error'
          })
        }
      }else{
        swal.fire({
          icon: 'error',
          title: 'Error al guardar prospecto',
          text: 'Ocurrio un error'
        })
      }
    })
  }

  goBack(){
    console.log("goBack");
    swal.fire({
      title: '¿Estas seguro?',
      text: "no se guardará ningún registro",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/prospectos'])
      }
    })
  }

  goProspecto(){
    this.router.navigate(['/prospectos'])
  }

  onStatus(){

    if(this.prospectoForm.invalid) return

    let pr:Prospecto = {
      apMaterno: '',
      apPaterno: '',
      authorization: '',
      calle: '',
      colonia: '',
      cp: '',
      nombre: '',
      numero: '',
      prospectoId: +this.prospectoId,
      rfc: '',
      stAutorization: +this.prospectoForm.value.stAutorization,
      telefono: '',
      fullDireccion: '',
      motivo: this.prospectoForm.value.motivo
    }

    console.log(pr); 

    this.prospectosService.status(this.prospectoId,pr).subscribe(data=>{
      console.log(data);
      if(data){
        swal.fire({
          icon: 'success',
          title: 'Registro Guardado',
          confirmButtonColor: '#3085d6'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/prospectos'])
          }
        })
      }else{
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un error'
        })
      }
    })
  }

  changeEstatus(event:any){
    // console.log(event);
    this.estatusProspecto = event
    if(event == 3){
      this.btnSubmit = true
      this.prospectoForm.controls['motivo'].setValidators([Validators.required])
    }else{
      this.btnSubmit = false
      this.prospectoForm.controls['motivo'].setValidators([])
    }
    this.prospectoForm.controls['motivo'].updateValueAndValidity()
  }

  files:Archivos[]=[]
  getArchivos(info:any){
    console.log("info",info);
    const intfile = info.target.files
    let extencion: string = String(intfile[0].name.split('.').pop())
    let name: string = String(intfile[0].name)

    console.log("file",intfile);
    console.log("extencion",extencion);

    this.files.push({
      archivo: intfile,
      nombre: name,
      extencion: extencion,
      ruta: '',
      prospectoId: 0
    })

  }

  loadArchivos(prospectoId: number){
    return new Promise((resolve, reject)=>{
      let i:number =  1
      let noFiles:number = this.files.length
      console.log("loadArchivos antes del for");
      this.files.forEach(file=>{
        file.prospectoId = prospectoId
        console.log("load",file);
        this.archivosService.loadFiles(file).subscribe(data=>{
          console.log(data);
          if(i == noFiles) resolve(true)
          i++;
        })
      })
      if(this.files.length == 0) resolve(false)
    })
  }

  addNewArchivo(){ 
    this.addFile.push({id: new Date().getMilliseconds});
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
  fullDireccion: string
  motivo: string
}

interface Archivos{
  archivo: FileList
  nombre: string
  extencion: string
  ruta: string
  prospectoId: number
}