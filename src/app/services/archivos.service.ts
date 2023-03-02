import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {


  url_api = 'https://localhost:44383/api/';

  constructor(private http: HttpClient) { }

  loadFiles(archivos:Archivos){

    const formData = new FormData();
    
    let file:any = archivos.archivo;

    for (let index = 0; index < file.length; index++) {
      const element = file[index];
      formData.append('archivo', element)
    }
    formData.append('nombre', archivos.nombre)
    formData.append('extencion',  archivos.extencion)
    formData.append('ruta', archivos.ruta)
    formData.append('prospectoId', archivos.prospectoId.toString())


    let url: string = `${this.url_api}Archivos/upload`;
    return this.http.post(`${url}`,formData);
  }


  read(prospectoId:number) 
  {
    let url: string = `${this.url_api}Archivos/${prospectoId}`;
    return this.http.get(`${url}`);
  }
}


interface Archivos{
  archivo: FileList
  nombre: string
  extencion: string
  ruta: string
  prospectoId: number
}