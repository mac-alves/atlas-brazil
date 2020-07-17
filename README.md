<h1 align="center">
  <img wi alt="ChatNode" width="550" src="https://res.cloudinary.com/dpf7e7tpc/image/upload/v1595019091/projetos/atlas-brasil_dpu20u.gif" />
</h1>

<h1 align="center">
  Atlas Brazil
</h1>
<h3 align="center">Atlas Brazil - implementation of the generation of TopoJson maps in a graphical interface</h3>
<br/>
<p align="center">

  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/mac-alves/atlas-brazil">

  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/mac-alves/atlas-brazil">

  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/mac-alves/atlas-brazil">

  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/mac-alves/atlas-brazil">

  <img alt="GitHub" src="https://img.shields.io/github/license/mac-alves/atlas-brazil">
</p>

<p align="center">
    <a href="#bulb-description">Description</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#rocket-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#information_source-how-to-use">How To Use</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#heavy_plus_sign-extra-information">Extra Information</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#link-useful-links">Useful Links</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#memo-license">License</a>
</p>

## :bulb: &nbsp;&nbsp;&nbsp; Description

This project aims to implement the generation of maps in a graphical interface so that it can be used as a basis in other projects.

Used based on the [Carolina](https://github.com/carolinabigonha/br-atlas) code for the generation of maps. All maps are downloaded from [IBGE (Instituto Brasileiro de Geografia e Estatística)](http://www.ibge.gov.br/), the agency responsible for
statistical, geographic, cartographic, geodetic and environmental information
in Brazil.

Page theme based on [Rocketseat](https://app.rocketseat.com.br/) login screen interface.

## :rocket: &nbsp;&nbsp;&nbsp; Technologies

This project was developed with the following technologies:
-  [D3.js](https://d3js.org/)
-  [TopoJson](https://github.com/topojson/topojson)
-  [Make](https://www.gnu.org/software/make/)
-  [Node.js v12.16.1][nodejs]
-  [Express](https://expressjs.com/pt-br/)
-  [TypeScript](https://www.typescriptlang.org/)
-  [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
-  [Babel](https://babeljs.io/)
-  [Edge](https://edge.adonisjs.com/)
-  [Express-Edge](https://github.com/ecrmnn/express-edge)
-  [Ts-Node-Dev](https://github.com/whitecolor/ts-node-dev)
-  [VS Code][vc] with [EditorConfig][vceditconfig]

## :bangbang: &nbsp;&nbsp;&nbsp; Dependencies
- [Git](https://git-scm.com),
- [GNU Make 4.1](https://www.gnu.org/software/make/)
- [Geospatial Data Abstraction Library (GDAL)](http://www.gdal.org/)
- [Node.js v12.16.1][nodejs] + [NPM v6.13.4][npm]

## :information_source: &nbsp;&nbsp;&nbsp; How To Use

```bash
# Install the dependencies global
$ sudo apt-get install gdal-bin

# Clone this repository
$ git clone https://github.com/mac-alves/atlas-brazil.git

# Go into the repository
$ cd atlas-brazil/

# Install dependencies
$ npm install

# Generate the json files of the maps
$ make

# delete unnecessary files
$ make clean-extra

# To run the project
$ npm run dev


####### Extra Commands #######

# To generate the production project
$ npm run build

# Execute project in production
$ npm start

# Generate map of brazil and its municipalities
$ make public/data/topo/br-municipalities.json

# Generate map of brazil and its states
$ make public/data/topo/br-states.json

# Generate specific state maps (type = [ municipalities, meso, micro, state ])
$ make public/data/topo/[state_abbreviation]-[type].json

```

## :heavy_plus_sign: &nbsp;&nbsp;&nbsp; Extra Information

- when executing the make command the TopoJSON and GeoJSON files are generated in the `topo/` and `geo/` folders.

- the files in the `public/data/geo/`, `zip/` and `tmp/` folders are not necessary for the execution of the project. If you want to delete them, run: make clean-extra

- The graphics generation script with d3js and topojson uses other versions of the libs. To install these versions on other platforms use:
    - `npm i d3@5.6.0`
    - `npm i topojson@3.0.2`


## :memo: &nbsp;&nbsp;&nbsp; License
This project is under the MIT license. See the [LICENSE](https://github.com/mac-alves/atlas-brazil/blob/master/LICENSE) for more information.

## :link: &nbsp;&nbsp;&nbsp; Useful Links
 - [Position the Maps](http://enjalot.github.io/intro-d3/maptime/geo/).
 - [Documentation d3js v5](https://devdocs.io/d3~5/)
 - [tutorials](https://vizhub.com/curran/8704c9b7c6df43cabf839aa3f1cb7b70?edit=files&file=bundle.js)

---

## Autor

:anchor: &nbsp;&nbsp; **Mauricio Alves** - *Github* - [mac-alves](https://github.com/mac-alves)


[nodejs]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[vc]: https://code.visualstudio.com/
[vceditconfig]: https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig
[vceslint]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
