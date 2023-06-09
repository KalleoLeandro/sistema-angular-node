import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastrosService {

  private url:string = "http://localhost:3000/";

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',      
    })
  }

  constructor(private http: HttpClient) { }

  public cadastrarUsuario(formulario:FormGroup):Observable<string>{
    return this.http.post<string>(`${this.url}cadastrarusuario`, formulario.getRawValue() , this.httpOptions);    
  }

  public atualizarUsuario(formulario:FormGroup):Observable<string>{
    return this.http.put<string>(`${this.url}atualizarusuario`, formulario.getRawValue() , this.httpOptions);    
  }

  public excluirUsuario(id:number):Observable<any>{
    return this.http.delete<string>(`${this.url}excluirusuario/${id}`, this.httpOptions);    
  }

  public cadastrarProduto(formulario:FormGroup):Observable<string>{
    return this.http.post<string>(`${this.url}cadastrarproduto`, formulario.getRawValue() , this.httpOptions);    
  }

  public excluirProduto(id:number):Observable<any>{
    return this.http.delete<string>(`${this.url}excluirproduto/${id}`, this.httpOptions);    
  }
}
