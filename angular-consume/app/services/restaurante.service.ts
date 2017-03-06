import { Injectable } from "angular2/core";
import { Http, Response,Headers } from "angular2/http"
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { Restaurante } from "../model/restaurante";

@Injectable()
export class RestauranteService {
    constructor(private _http: Http) { }

    getRestaurantes() {
        return this._http.get("http://localhost:8080/api/restaurante").map(res => res.json());
    }

    getRestaurante(id: string) {
        return this._http.get("http://localhost:8080/api/restaurante/" + id).map(res => res.json());
    }

    addRestaurante(restaurante:Restaurante) {
        let json=JSON.stringify(restaurante);
        let params="json"+json;
        let headers=new Headers({'Content-Type':'application/json'});
        console.log(json);
        console.log(headers);
        return this._http.post("http://localhost:8080/api/restaurante",
        params,{headers:headers}).map(res=>res.json);
    }
}