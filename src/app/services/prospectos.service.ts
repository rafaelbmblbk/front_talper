import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProspectosService {

  url_api = 'https://localhost:44383/api/';

  constructor(private http: HttpClient) { }

  query() 
  {
    let url: string = `${this.url_api}prospectos`;
    return this.http.get(`${url}`);
  }

  read(prospectoId:number) 
  {
    let url: string = `${this.url_api}prospectos/${prospectoId}`;
    return this.http.get(`${url}`);
  }

  insert(prospecto:Prospecto) 
  {
    let url: string = `${this.url_api}prospectos`;
    return this.http.post(`${url}`,prospecto);
  }

  status(prospectoId:number,prospecto:Prospecto) 
  {
    let url: string = `${this.url_api}estatus`;
    return this.http.post(`${url}`,prospecto);
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
}