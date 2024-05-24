## Acerca de

Este repositorio contiene el código para la aplicación _Citenik Bank_ para la _empresa Kinetic_.

## Requerimientos

Para levantar la aplicacion, desde el Frontend sera necesario tener Angular (>= `13.3.10`) instalado, y NET.core 6.0 para el Backend.

La Base de Datos es MySQL en su version `8.0.17 Community Server`

Se debera contar con alguna version de Git instalada.

### Servicios

El repositorio contiene 3 carpetas:
`citenik-backend`, `citenik-database`, `citenik'frontend`. La primera de ellas contiene los servicios relacionados con la aplicacion de NET.core 6.0, para levantar las API's necesarias. Por otro lado, segunda carpeta contiene los scripts referidos a las tablas de la Base de Datos propia. Y por ultimo la tercer carpeta contiene los componenetes que haran funcionar el frontend utilizando Angular como aplicacion.
Los servicios contenidos en las mismas se detallan a continuación:

- `webapi`: API Rest desarrollada en .NET Core.
- `webapp`: Aplicación web desarrollada en Angular 13.3.10.

##### Base de datos

Los componentes de la Base de Datos son los siguientes:

- Clientes

Estos valores componen la cadena de conexión a la base de datos MySQL ubicada en el archivo `appsettings.json` :

- Server=: Nombre de dominio del servidor de base de datos.
- User=: Nombre de usuario de aplicación.
- Password=: Contraseña del usuario de aplicación.
- Database=: Nombre de la base de datos.

##### Frontend

Los componentes que fueron desarrolados para poder levantar la aplicacion en Angular son:

- Cliente: Para el alta y consulta de Clientes fueron desarrollados los componentes: -`alta-cliente` -`consultar-cliente`

- Componentes en común: Fue desarrollada una carpeta `shared`, en donde se encuentran aquellos componentes que son reutilizados en toda la pagina, los cuales son: - `footer` - `home` - `menu` - `modal` - `navbar` - `carousel`

##### Backend

Estos valores se corresponden con la dependencia de los servicios Rest provistos por la Web API.

- `BACKEND_URL`: Url de acceso a los servicios de la Web API.

## Buenas Prácticas aplicadas

- El código debe estar documentado siempre definiendo las siguientes secciones:
  //SISTEMA
  Aqui iran todas las importaciones referidas a archivos necesarios de acceder propios del framework utilizado o de extensiones.

  //COMPONENTES
  Aqui se hacen las llamadas a las diferentes clases y componentes que queramos utilizar en nuestro código.

  //SERVICIOS
  Aqui se realizan las llamadas a los diferentes servicios que queramos inyectar en nuestro código.

  //VARIABLES DE DATOS
  Sección en donde se encontraran todas aquellas variables locales que respondan a un tipo de dato propio del sistema.

  //VARIABLES DE OBJETOS LIST
  Sección donde estaran todos los objetos tipo Array que utilicemos en el código.

  //VARIABLES DE CLASES
  Sección donde encontaremos todos los objetos particulares que utilicemos en el código.

  //FORMULARIO PARA LA AGRUPACIÓN DE DATOS
  Sección que incluira todos aquellos formularios que se utilicen para desplegar información.

- Las variables de datos deben estar agrupadas según su tipo de dato.

- Las funciones deben encontrarse ordenadas de acuerdo a los criterios siguientes:
  1. Acción de la función, ej: las acciones relacionadas con botones siempre iran al final.
  2. Nombre de la función.
  3. Relación de una función con otra.
