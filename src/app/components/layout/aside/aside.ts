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
                        { label: 'Listado', icon: 'pi pi-list', routerLink: ['/citas/getall'] },
                        { label: 'Nueva', icon: 'pi pi-plus', routerLink: ['/citas/create'] }
                    ]
                },
                {
                    label: 'Pacientes', icon: 'pi pi-users', items: [
                        { label: 'Listado', icon: 'pi pi-list', routerLink:"[/patients/getall" },
                        { label: 'Nuevo', icon: 'pi pi-user-plus', routerLink: ['patients/create'] },
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
                            { label: 'Listado', icon: 'pi pi-list', routerLink: ['/citas/getall'], badge: '42' },
                            { label: 'Nueva', icon: 'pi pi-plus', routerLink: ['/citas/create'] },
                            
                        ]
                    },
                    {
                        label: 'Pacientes',
                        icon: 'pi pi-users',
                        items: [
                            { label: 'Listado', icon: 'pi pi-list', routerLink: ['/patients/getall'] },
                            { label: 'Nuevo', icon: 'pi pi-user-plus', routerLink: ['patients/create'] },
                            { label: 'Resumen', icon: 'pi pi-id-card', routerLink: ['/pacientes/resumen'] }
                        ]
                    }
                ]
            },

            {
                label: 'Diagnósticos',
                icon: 'pi pi-search',
                items: [
                    {
                        label: 'Añadir',
                        icon: 'pi pi-flask',
                        routerLink: ['/forms/create']
                       
                    },
                    {
                        label: 'Mostrar',
                        icon: 'pi pi-flask',
                        routerLink: ['/forms/getall']
                    }
                ]
            },

    
        ];
    }

}