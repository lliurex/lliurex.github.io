# EPI 

EPI ( EASY PACKAGE INSTALLER ) es un programa para empaquetar instalaciones mas complicadas que no se pueden realizar mediante debs o para aquellos casos en los cuales la instalacion de un paquete se quiere realizar de una forma sencilla ( mediante el zero-center ).

Un paquete epi puede consistir en dos ficheros:
    - fichero epi
    - script de instalacion.
El fichero .epi si que es necesario, mientras que el script de instalacion solo es necesario en caso de que se quiera hacer algun proceso en alguna de las fases que ejecuta EPI.
Por convención los ficheros se instalaran en la ruta /usr/share/NOMBREDELPAQUETE.

## Formato de fichero epi
El fichero epi es el fichero que contiene toda la meta informacion sobre el proceso de instalacion, como puede ser la url desde donde se bajara los ficheros necesarios, si necesita de permisos de root. Es un fichero que tiene un mimetype asociado, por lo que al hacer doble click sobre el se lanzara la aplicacion epi-gtk y por lo que tiene una extension .epi .

### Claves del fichero
 * **type**
    - Required : True
    - Type : String
    - Values : [ "apt" | "deb" | "file" ]
    - Description : Describe el tipo de EPI que es.
        - Apt: Realiza una instalacion desde un repositorio mediante apt. Puede ser el propio que ya se dispone u otro que se añade para la ocasion
        - Deb: Instala un deb que puede estar disponible en el sistema o que puede estar en una url.
        - File : Ejecuta los pasos que se le indiquen en el fichero de script en el paso de instalación.
    - Example : ```{ ... type: "apt" ... } ```
 * **script**
    - Required : file type. *( Solo es obligado ofrecer este fichero en el tipo "file", en el resto de tipos es opcional y serviria para ayudar realizando ajustes en las distintas fases de instalación )*
    - Description : Indica el script donde están indicado los pasos.
    - Type : Dictionary
    - Keys : 
        - name ( STRING ) : Ruta donde se encuentra el script. Esta debe ser una ruta absoluta.
        - modes ( DICTIONARY ): Diccionario que indica cuales son las fases que se han de ejecutar. Contiene todas las fases que han de llamar desde epi. Estas son : **preinstall**, **install**, **postinstall**, **remove** y los valores de estos son **true** o **false**. ESTE ATRIBUTO EN UN FUTURO SE DEBERIA DEPRECAR PARA FACILITAR LA ESCRITURA Y SOLO USAR __remove__ pero no dentro del keys, sino como key de **script**. 
        - remove ( BOOLEAN ) : **Pendiente de aprovar** Este atributo indicara si el script tiene fase de desinstalación, y sobretodo esta pensado para notificar a la gui que tiene una fase de desisntalación.
    - Example: ```{ ... "script" : { "name" : "/usr/share/foo/foo_script" , "modes" : { "preinstall" : true, "install" : false, "postinstall" : true , "remove" : false } } ... }```
 * **depends**
    - Required: all types
    - Type : String
    - Description: Este atributo sirve para crear dependencias con otro epi. Sirve para asegurarse que otro epi se ha instalado correctamente antes de instalar nuestro epi. Hay que indicarle la ruta donde se encutra dicho epi. Esto tiene la problematica de que no se puede realizar una dependencia con un nombre unico debido a que no se dispone de un respositorio de epi's.
    - Example: ```{ ... "depends":"/usr/share/zero-google-earth/google-earth.epi" ... } ```
 * **pkg_list**
    - Required: deb | apt type
    - Description : Lista de paquetes que instalara en la fase de instalación.
    - Type : List
    - Keys:
        - name ( STRING ) : Nombre del paquete a instalar. Este tambien sera el nombre que se utilice a la hora de mostrar en la gui.
        - key_store ( STRING ) : "Nombre del paquete en la store para obtener metainformacion"
        - **--- Only on deb type ---**
        - version: En caso de ser un deb puede tener distintos debs para distintas arquitecturas. En este campo se le indica el nombre del deb que tiene que instalar / descargar dependiendo de la arquitectura. Los valores que puede tomar son **all**, **64b** y **32b**, donde all no distingue entre arquitecturas y los otros dos campos restantes equivalen a lo que indica. **Ejemplo** : ``` "version":{"all":"","64b":"google-earth-stable_current_amd64.deb","32b":"google-earth-stable_current_i386.deb"} ```
        - url_download ( STRING ) : Direccion desde donde se ha de descargar el deb. Se puede utilizar el protocolo http o file. Para realizar la descarga solo se indica la ruta base donde estan los debs. En caso de estuviera en carpetas distintas, en este atributo se deberia de poner la ruta comun y completar la ruta en el campo version. Los ficheros descargados se guardaran en la ruta */var/cache/epi-downloads/*
    - Example: ```{ ... "pkg_list" : [{"name":"google-earth-pro-stable","version":{"all":"","64b":"google-earth-stable_current_amd64.deb","32b":"google-earth-stable_current_i386.deb"},"key_store":"zero-lliurex-gearth","url_download":"http://dl.google.com/dl/earth/client/current/"}] ...}```
 * **name**
    - Required: file type
    - Type : String
    - Description: Tiene el mismo comportamiento que name en **pkg_list**
 * **key_store**
    - Required: file type
    - Type : String
    - Description: Tiene el mismo comportamiento que key_store en **pkg_list**
 * **version**
    - Required : file type
    - Type : List
    - Description: Tiene el mismo comportamiento que version en **pkg_list**. En este caso sobretodo se utiliza para saber que version ha de descargar, ya que normalmente este tipo de epi se utiliza para instalar aplicaciones que se ha de descargar de la pagina oficial.
 * **repository**
    - Required: apt type
    - Type : List
    - Description: Lista de de los repositorios que se han de añadir temporalmente para instalar los paquetes indicados en el pkg_list en el tipo de apt. Estos repositorios y claves seran borrados una vez se termine de realizar la instalacion.
    - Keys:
        - url ( STRING ) : Linea exacta que se añadiria en un sources.list del repositorio.
        - key_cmd ( STRING ) : Comando que se utilizara para añadir las keys del repositorio para que sea una fuente confiable.
    - Example : ``` {... "repository": [{"url":"deb http://repository.spotify.com stable non-free","key_cmd":"apt-key --keyring /tmp/epi_keyring adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys BBEBDCB318AD50EC6865090613B00F1FD2C19886 0DF731E45CE24F27EEEB1450EFDC8610341D9410"}] ...} ```
 * **force32**
    - Required: All types
    - Type:  Boolean
    - Description: Fuerza a que en la instalacion se realize en base a 32 bits
 * **require_x**
    - Required: All types
    - Type:  Boolean
    - Description: Le dice al instalador que para llevar a cabo este proceso es necesario que se ejecute este proceso en una sesion grafica con escritorio. Esto sobretodo se utiliza para aquellos casos en los que las aplicaciones van a lanzar una aplicacion grafica que pide datos.
 * **zomando**
    - Required: All types
    - Type: String
    - Description: Aqui se indica el zomando asociado (puede no tenerlo) para realizar las modificaciones del estado correspondiente a este. De esta forma si se instala un paquete en el zero-center se representara como instalado.
 * **download_script**
    - Required: file type
    - Type: Boolean
    - Description: Este campo se usa para indicarle a la interfaz que tiene que ser ella la que gestione la descarga. De esta forma si el valor de este campo es **false** EPI sera el encargado de descargar los ficheros asociados (debs o ficheros) basados en la arquitectura en la que estes. De otra forma la descarga de los ficheros se tendra que hacer de forma manual desde dentro del script, en la cual se tendra que comprobar que tipo de arquitectura eres y en base a eso bajar uno u otro. Todos los ficheros descargados mediante esto van a la ruta */var/cache/epi-downloads/*
 * **url_download**
    - Required: file type
    - Type: Boolean
    - Description: Tiene un comportamiento similar a url_download de **pkg_list**. En este caso esta pensado para los epis de tipo file
 * **require_root**
    - Required: file type
    - Type: Boolean
    - Description: Este campo esta pensado para indicarle al instalador que se require de permisos de root para poder instalar esta aplicacion. Esta enfocado para aquellas aplicaciones que pueden ser instalados en el home del usuario. De esta forma si la aplicacion se instala en su home el valor de este atributo sera false.

## Formato del script de instalacion
El script de instalacion es el encargado de indicar todas las acciones que se ejecutaran en las distintas fases que ejecuta EPI. Estas fases son las siguientes:
    - preinstall
    - install
    - postinstall
    - remove

En cada una de las fases se llama el script entero pasandole como argumento la fase en la que se encuentra. Por esta razon se ha de hacer una comparacion del argumento que estamos recibiendo para ejecutar los pasos de instalacion o para realizar el paso de desinstalacion. Es **importante** que el script termine con exit 0 y en caso de que exista un error se salga del scritp con exit 1

### Example 
```
#!/bin/bash

ACTION="$1"
VERSION="AdobeAIRInstaller.bin"
PACKAGE_NAME="adobeair"
APP_PATH="/var/cache/epi-downloads/"
LOG_FILE="/tmp/zero-adobeair.log"
uname -m > /tmp/architectur.txt
if [ $(grep "x86_64" /tmp/architectur.txt) ] ; then
	ARCH="64"
else
	ARCH="32"
fi

case $ACTION in

	preInstall)

	;;

	install)
		
		chmod +x $APP_PATH$VERSION
											    
		$APP_PATH$VERSION -silent -eulaAccepted -pingbackAllowed
		TEST=$( dpkg-query -s $PACKAGE_NAME 2> /dev/null| grep Status | cut -d " " -f 4 )
		if [ "$TEST" != 'installed' ]; then
			exit 1			
		fi
	;;
	
	postInstall)
		
	;;
	
esac
exit 0
```