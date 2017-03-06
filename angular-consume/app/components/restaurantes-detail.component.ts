import { Component, OnInit } from "angular2/core";
import { RouteParams,Router } from "angular2/router";
import { RestauranteService } from "../services/restaurante.service";
import { Restaurante } from "../model/restaurante";

@Component({
    selector: "restaurantes-list",
    templateUrl: "app/view/restaunrantes-detail.html",
    providers: [RestauranteService]
})
export class RestaurantesDetailComponent implements OnInit {

    public parametro;
    public restaurante: Restaurante[];
    public errorMessage;
    constructor(
        private _restauranteService: RestauranteService,
        private _routeParams: RouteParams,
        private _router:Router
    ) { }
    ngOnInit() {
        this.getRestaurante();
    }

    getRestaurante() {
        let id = this._routeParams.get("id");
        this._restauranteService.getRestaurante(id)
            .subscribe(
            response => {
                this.restaurante = response.restaurante
            },
            error => {
                this.errorMessage = error.message;
                if (this.errorMessage !== null) {
                    //console.log(this.errorMessage);
                    //alert("Error en la peticion" + this.errorMessage);
                    this._router.navigate(["Home"]);
                }
            });
    }
}