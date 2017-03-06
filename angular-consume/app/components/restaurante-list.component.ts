import { Component, OnInit } from "angular2/core";
import { ROUTER_DIRECTIVES, RouteConfig, Router } from "angular2/router";
import { RestauranteService } from "../services/restaurante.service";
import { Restaurante } from "../model/restaurante";

@Component({
    selector: "restaurantes-list",
    templateUrl: "app/view/restaunrantes-list.html",
    directives:[ROUTER_DIRECTIVES],
    providers: [RestauranteService]
})
export class RestaurantesListComponent implements OnInit{
    public titulo: string = "Listado de restaunrantes:";
    public restaurantes: Restaurante[];
    public status: string;
    public errorMessage;
    public loading;

    constructor(private _restauranteService: RestauranteService) { }

    ngOnInit() {
        this.getRestaurantes();
        this.loading='show';
        console.log('trayendo listado de url');
    }

    getRestaurantes() {
        this._restauranteService.getRestaurantes()
            .subscribe(result => {
                this.restaurantes = result.restaunrantes;
                this.status = result.status; 
                this.loading='hide';
            },
             error => {
                this.errorMessage = error.message;
                if (this.errorMessage !== null) {
                    console.log(this.errorMessage);
                    alert("Error en la peticion"+this.errorMessage);
                }
            })
    }
}