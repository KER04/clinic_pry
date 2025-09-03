import { Component, OnInit } from '@angular/core';
import {  RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
    selector: 'app-aside',
    imports: [PanelMenu, RouterModule],
    templateUrl: './aside.html',
    styleUrl: './aside.css'
})
export class Aside implements OnInit {
    items: MenuItem[] = [

        {
            label: 'Atención', icon: 'pi pi-briefcase', items: [
                {
                    label: 'Citas', icon: 'pi pi-calendar', items: [
                        { label: 'Listado', icon: 'pi pi-list', routerLink: ['/citas/listado'] },
                        { label: 'Nueva', icon: 'pi pi-plus', routerLink: ['/citas/nueva'] }
                    ]
                },
                {
                    label: 'Pacientes', icon: 'pi pi-users', items: [
                        { label: 'Listado', icon: 'pi pi-list', routerLink: ['/pacientes'] },
                        { label: 'Nuevo', icon: 'pi pi-user-plus', routerLink: ['/pacientes/nuevo'] },
                    ]
                }
            ]
        },




    ];

    ngOnInit() {
        this.items = [
            {
                label: 'Atención',
                icon: 'pi pi-briefcase',
                items: [
                    {
                        label: 'Citas',
                        icon: 'pi pi-calendar',
                        items: [
                            { label: 'Listado', icon: 'pi pi-list', routerLink: ['/citas/listado'], badge: '42' },
                            { label: 'Nueva', icon: 'pi pi-plus', routerLink: ['/citas/nueva'] },
                            { label: 'Pendientes', icon: 'pi pi-clock', routerLink: ['/citas/listado'], queryParams: { estado: 'pendiente' }, badge: '3' }
                        ]
                    },
                    {
                        label: 'Pacientes',
                        icon: 'pi pi-users',
                        items: [
                            { label: 'Listado', icon: 'pi pi-list', routerLink: ['/pacientes'] },
                            { label: 'Nuevo', icon: 'pi pi-user-plus', routerLink: ['/pacientes/nuevo'] },
                            { label: 'Resumen', icon: 'pi pi-id-card', routerLink: ['/pacientes/resumen'] }
                        ]
                    }
                ]
            },

            {
                label: 'Diagnóstico',
                icon: 'pi pi-search',
                items: [
                    {
                        label: 'Laboratorio',
                        icon: 'pi pi-flask',
                        items: [
                            { label: 'Órdenes', routerLink: ['/lab/ordenes'] },
                            { label: 'Resultados', routerLink: ['/lab/resultados'] }
                        ]
                    },
                    {
                        label: 'Imágenes',
                        icon: 'pi pi-image',
                        items: [
                            { label: 'Solicitudes', routerLink: ['/rx/solicitudes'] },
                            { label: 'Lecturas', routerLink: ['/rx/lecturas'] }
                        ]
                    }
                ]
            },

            {
                label: 'Tratamientos',
                icon: 'pi pi-heart',
                items: [
                    { label: 'Recetas', icon: 'pi pi-file-edit', routerLink: ['/recetas'] },
                    { label: 'Procedimientos', icon: 'pi pi-plus-circle', routerLink: ['/procedimientos'] },
                    { label: 'Hospitalizaciones', icon: 'pi pi-verified', routerLink: ['/hospitalizaciones'] }
                ]
            },

            {
                label: 'Gestión',
                icon: 'pi pi-cog',
                items: [
                    { label: 'Caja / Facturación', icon: 'pi pi-wallet', routerLink: ['/caja'] },
                    { label: 'Seguros / Autorizaciones', icon: 'pi pi-shield', routerLink: ['/seguros'] },
                    { label: 'Inventario / Farmacia', icon: 'pi pi-shopping-bag', routerLink: ['/farmacia'] }
                ]
            },

            { label: 'Reportes', icon: 'pi pi-chart-bar', routerLink: ['/reportes'] },
            { label: 'Administración', icon: 'pi pi-sliders-h', routerLink: ['/admin'] }
        ];
    }

}