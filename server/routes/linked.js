

const express = require("express");
const router = express.Router();
const { getItemsByParameter, getEntitiesWithMostRelations,getEntitiesWithAverageRelations } = require('../utils/queryHelper');

const relations = [
    {from: 'artworks', to: 'artists', through: 'created_by'},
    {from: 'artists', to: 'artworks', through: 'created_by'},
    {from: 'artworks', to: 'museums', through: 'belongs_to'},
    {from: 'collectors', to: 'artworks', through: 'owned_by'},
    {from: 'art_periods', to: 'artists', through: 'lived_in'},
    {from: 'artworks', to: 'art_periods', through: 'included_in'},
    {from: 'artists', to: 'art_styles', indirect: {through: 'created_by', via: 'falls_under', on: 'artworks'}},
    {from: 'art_styles', to: 'artists', indirect: {through: 'falls_under', via: 'created_by', on: 'artworks'}},
    {from: 'artworks', to: 'collectors', through: 'owned_by'},
    {from: 'artworks', to: 'art_styles', through: 'falls_under'},
    {from: 'artists', to: 'art_periods', through: 'lived_in'},
    {from: 'museums', to: 'artworks', through: 'belongs_to'},
    {from: 'art_periods', to: 'artworks', through: 'included_in'},
    {from: 'artists', to: 'museums', indirect: {through: 'created_by', via: 'belongs_to', on: 'artworks'}},
    {from: 'museums', to: 'artists', indirect: {through: 'belongs_to', via: 'created_by', on: 'artworks'}},
    {from: 'art_styles', to: 'artworks', through: 'falls_under'},
    {from: 'collectors', to: 'art_styles', indirect: {through: 'owned_by', via: 'falls_under', on: 'artworks'}},
    {from: 'art_styles', to: 'collectors', indirect: {through: 'falls_under', via: 'owned_by', on: 'artworks'}},
    {from: 'artists', to: 'collectors', indirect: {through: 'created_by', via: 'owned_by', on: 'artworks'}},
    {from: 'collectors', to: 'artists', indirect: {through: 'owned_by', via: 'created_by', on: 'artworks'}},
    {from: 'museums', to: 'art_periods', indirect: {through: 'belongs_to', via: 'included_in', on: 'artworks'}},
    {from: 'art_periods', to: 'museums', indirect: {through: 'included_in', via: 'belongs_to', on: 'artworks'}},
    {from: 'museums', to: 'art_styles', indirect: {through: 'belongs_to', via: 'falls_under', on: 'artworks'}},
    {from: 'art_styles', to: 'museums', indirect: {through: 'Falls_under', via: 'belongs_to', on: 'artworks'}},
    {from: 'museums', to: 'collectors', indirect: {through: 'belongs_to', via: 'owned_by', on: 'artworks'}},
    {from: 'collectors', to: 'museums', indirect: {through: 'owned_by', via: 'belongs_to', on: 'artworks'}},
    {from: 'art_periods', to: 'art_styles', indirect: {through: 'included_in', via: 'falls_under', on: 'artworks'}},
    {from: 'art_styles', to: 'art_periods', indirect: {through: 'falls_under', via: 'included_in', on: 'artworks'}},
    {from: 'art_periods', to: 'collectors', indirect: {through: 'included_in', via: 'owned_by', on: 'artworks'}},
    {from: 'collectors', to: 'art_periods', indirect: {through: 'owned_by', via: 'included_in', on: 'artworks'}},
];


function generateRoutes(relations) {
    const routes = [];

    // Generate routes for getting entities by parameter
    relations.forEach(relation => {
        const routeName = `get${capitalize(relation.to)}By${capitalize(relation.from)}`;
        const url = `/${relation.from}/${relation.to}/:${relation.to}Id`;

        let routeFunction;
        if (relation.indirect) {
            routeFunction = async (req, res) => {
                console.log(`Handling request for route: ${req.path}`);
                getItemsByParameter(req, res, relation.from, relation.to, relation.indirect.through, relation.indirect.via, relation.indirect.on);
                console.log(`Finished handling request for route: ${req.path}`);
            };
        } else {
            routeFunction = async (req, res) => {
                console.log(`Handling request for route: ${req.path}`);
                getItemsByParameter(req, res, relation.from, relation.to, relation.through);
                console.log(`Finished handling request for route: ${req.path}`);
            };
        }

        routes.push({
            name: routeName,
            url: url,
            handler: routeFunction
        });
        console.log(`Generated route - name: ${routeName}, url: ${url}`);
        if (!relation.indirect) {
            const routeName = `get${capitalize(relation.from)}WithMost${capitalize(relation.to)}`;
            const url = `/${relation.from}/most_${relation.to}`;

            const routeFunction = async (req, res) => {
                console.log(`Handling request for route: ${req.path}`);
                getEntitiesWithMostRelations(relation.from, relation.to, relation.through, req, res);
                console.log(`Finished handling request for route: ${req.path}`);
            };

            routes.push({
                name: routeName,
                url: url,
                handler: routeFunction
            });
            console.log(`Generated route - name: ${routeName}, url: ${url}`);
        }
        if (!relation.indirect) {
            const routeName = `get${capitalize(relation.from)}WithAverage${capitalize(relation.to)}`;
            const url = `/${relation.from}/Avg_${relation.to}`;

            const routeFunction = async (req, res) => {
                console.log(`Handling request for route: ${req.path}`);
                getEntitiesWithAverageRelations(relation.from, relation.to, relation.through, req, res);
                console.log(`Finished handling request for route: ${req.path}`);
            };

            routes.push({
                name: routeName,
                url: url,
                handler: routeFunction
            });
            console.log(`Generated route - name: ${routeName}, url: ${url}`);
        }
    });

    return routes;
}


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const linkedRoutes = generateRoutes(relations);

linkedRoutes.forEach(route => {
    router.get(route.url, route.handler);
});
console.log(`Generated ${linkedRoutes.length} routes`);
module.exports = router;