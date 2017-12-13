# BUILDING FIREFOX-ESR FOR LLIUREX
Debido a la necesidad de poder ejecutar los plugins de java y flash en Lliurex se incluye el firefox-esr. Por tal de diferenciarlo de Firefox se crea una compilación personalizada que nos permite por un lado mantener ambos navegadores con sus configuraciones completamente diferenciadas y por otro lado diferenciar ambos programas de cara al entorno de escritorio.
En la página oficial de Mozilla encontramos las instrucciones genéricas para compilar Firefox ( https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Build_Instructions/Simple_Firefox_build/Linux_and_MacOS_build_preparation ) pero debido a las diferencias del procedimiento entre versiones de Firefox y la dispersión de la información necesaria para conseguir una compilación personalizada de Firefox hemos decidido crear esta pequeña guía.

## 1.- Paquetes requeridos
Firefox solo puede compilarse en máquinas de 64 bits. Si se necesita una versión para 32 bits (i386 a partir de ahora) es necesario crear un entorno de chroot dentro de la máquina de 64 bits (amd64 a partir de ahora). Como en Lliurex necesitamos ambas versiones la lista de paquetes requeridos es bastante extensa:

### amd64

* python
* GCC >= 4.9.9
* autoconf2.13
* rustc
* cargo
* libgtk-3-dev
* libgconf2-dev
* libdbus-glib-1-dev
* libpulse-dev
* yasm

```sh
sudo apt-get install mercurial python autoconf2.13 rustc cargo libgtk-3-dev libgconf2-dev libdbus-glib-1-dev libpulse-dev yasm gcc
```

### i386
* schroot
* gcc-multilib
* g++-multilib

```sh
sudo apt-get install schroot gcc-multilib g++-multilib
```

## 2.- Descargar fuentes
Para descargar las fuentes debemos acceder al [servidor de descargas de mozilla](https://archive.mozilla.org/pub/firefox/releases/) y buscar el último directorio de la versión 52 disponible (52.5.2esr a la hora de escribir esta guía).
Una vez en el directorio entraremos en la carpeta <b>source</b> y descargaremos el fichero acabado en <i>source.tar.xz</i>.

Una vez obtenido lo descomprimimos en nuestro directorio de trabajo y ya podemos empezar con el proceso de compilación.

## 3.- El entorno de compilación
Mozilla utiliza un entorno de compilación propio para generar sus programas (firefox, thunderbird...) basado en ficheros <i>mozconfig</i> que son los encargados de asignar las opciones de configuración y compilación de los programas.
Dichos ficheros soportan varias directivas:

* export -> Exporta el valor de una variable
* ac_add_options -> Opciones de configuración
* mk_add_options -> Opciones de compilación
El fichero mozconfig usado en nuestra compilación tiene las siguientes configuraciones:

```
#Lliurex mozconfig file
###Place this file on the top sources dir###
#Compiler options
ac_add_options --with-pthreads
ac_add_options --with-ccache
ac_add_options "--enable-optimize=-O3 -msse2 -mfpmath=sse"
#Enable firefox build
ac_add_options --enable-application=browser
#Dir with the customized branding
ac_add_options --with-branding=browser/branding/unofficial
#Run options
ac_add_options --enable-startup-notification
ac_add_options --enable-official-branding
ac_add_options --enable-strip
ac_add_options --enable-js-shell
ac_add_options --enable-profiling
ac_add_options --enable-default-toolkit=cairo-gtk3
#Disabled 
ac_add_options --disable-debug-symbols
ac_add_options --disable-tests
ac_add_options --disable-ipdl-tests
ac_add_options --disable-maintenance-service
ac_add_options --disable-updater                                                                                                                                                              
ac_add_options --disable-tests
ac_add_options --disable-debug
ac_add_options --disable-crashreporter
ac_add_options --disable-calendar
#Export variables (will be set again in other customized files)
export MOZ_APP_NAME=firefoxESR
export MOZ_APP_DISPLAYNAME=FirefoxESR
#Build options
mk_add_options MOZ_CO_PROJECT=browser
mk_add_options MOZ_MAKE_FLAGS=-j5 #Adjust to match your cores
mk_add_options AUTOCLOBBER=1
mk_add_options MOZ_APP_NAME=firefoxESR
mk_add_options MOZ_APP_DISPLAYNAME=FirefoxESR
```

Junto a este fichero es necesario modificar la shell <i>confvars.sh</i> presente en el directorio "browser" para redefinir las vartiables MOZ_APP_BASENAME y MOZ_APP_VENDOR.

```sh
MOZ_APP_BASENAME=firefoxESR
MOZ_APP_VENDOR=Lliurex
```
dejando el resto de la shell sin modificar.

## 4.- Personalizar firefox
Una vez hemos creado nuestro fichero de configuración es hora de modificar los ficheros necesarios para que nuestro firefox-esr quede claramente diferenciado del firefox, para ello debemos modificar el <i>branding</i> y ajustarlo a nuestros requerimientos. En este punto podríamos también modificar los ficheros de preferencias pero estos los agregaremos posteriormente en el proceso de empaquetado.

El <i>branding</i> de firefox consiste en los iconos y otros elementos visuales de la aplicación. La recomendación de Mozilla es usar el branding oficial para compilaciones limpias de los programas, aurora para las compilaciones de desarrollo, nightly para las nightly-builds y unofficial para las personalizaciones no soportadas de forma oficial. En nuestro caso podríamos usar el branding oficial pero debido a que modificamos el nombre del binario y el de la clase de ventana optamos por gastar <i>unofficial</i>.

Para realizar nuestra modificación accedemos al directorio <i>browser/branding/unofficial</i> y realizamos los siguientes ajustes:

* Copiamos los ficheros de imágenes (*bmp,*png y *ico) del directorio browser/branding/aurora 
* Modifcamos la shell <i>configure.sh</i> dejándola con el siguiente contenido:

```sh
MOZ_APP_BASENAME="firefoxESR"
MOZ_APP_VENDOR="Mozilla"
MOZ_APP_PROFILE=mozilla/firefoxESR
MOZ_APP_NAME=firefoxESR
```
* Dentro de la carpeta <i>locales</i> creamos los directorios ca y es-ES y copiamos en cada uno de ellos el contenido del directorio en-US asignando "firefoxESR" a los valores relativos a la app y dejando los valores relativos a vendor como "Mozilla".
* Opcionalmente dentro del directorio <i>pref</i> podemos crear un fichero de configuración o modificar el existente pero esto, como ya hemos señalado, lo haremos en la fase de empaquetado.

Una vez finalizado ya deberíamos tener todo listo para compilar firefox con nuestras opciones que darán lugar a un ejecutable llamado firefoxESR que usará como directorio de perfiles <i>~/.mozilla/firefoxesr</i> de forma y manera que podrá convivir con una instalación normal de firefox y usar en cada uno distintas configuraciones o complementos.

## 5.- Compilar para amd64
Una vez configurados todos los ficheros compilar para amd64 pasa por situarnos en el directorio raíz de las fuentes y ejecutar los siguientes comandos

```sh
./mach configure
./mach build
./mach run
./mach package
```
El primer comando lanza el configure, el segundo comando ejecuta la compilación y con el tercero podemos lanzar el firefox que acabamos de compilar para comprobar que todo sale según lo esperado.
Si todo se muestra tal y como debe con el último comando prepararemos el código para poder generar el paquete .deb.

## 6.- Compilar para i386
Para compilar para i386 necesitaremos, en Lliurex y otros derivados de Ubuntu/Debian, un entorno chroot de 32bits. Hemos optado por schroot como aplicación para generar nuestro chroot por su sencillez para configurarlo.
También necesitaremos instalar los paquetes gcc-multilib y g++-multilib que nos permitirán generar binarios para i386.

### Configuración del entorno chroot
* Instalamos el paquete y creamos el directorio de trabajo

```sh
sudo apt-get install schroot
sudo mkdir -p /var/chroot/linux32
```

* Configuramos schroot
Para ello abrimos el fichero <i>/etc/schroot/schroot.conf</i> y escribimos la configuración

```sh
[linux32]
description=Linux32 build environment
aliases=default
type=directory
directory=/var/chroot/linux32
personality=linux32
profile=desktop
users=****
root-users=****
```
En los campos <i>users</i> y <i>root_users</i> pondremos nuestro usuario local.

* Agregamos la memoria compartida al chroot
Para ello editamos el fichero <i>/etc/schroot/desktop/fstab</i> y agregamos la siguiente linea:

```sh
/dev/shm       /dev/shm        none    rw,bind         0       0
```
* Instalamos el sistema de 32 bits en el chroot

```sh
sudo debootstrap --variant=buildd --arch=i386 --foreign xenial /var/chroot/linux32 http://archive.ubuntu.com/ubuntu
```
* Accedemos al chroot y finalizamos la instalación del sistema

```sh
sudo schroot /var/chroot/linux2
/debootstrap/debootstrap --second-stage
```
* Agregamos los repositiorios (dentro del chroot)
Para ello editamos el fichero <i>/etc/apt/sources.list</i> y agregamos los repositorios de ubuntu.

```sh
echo "deb http://archive.ubuntu.com/ubuntu xenial main universe
deb http://archive.ubuntu.com/ubuntu xenial-updates main universe" > /etc/apt/sources.list
apt-get update
apt-get install libasound2-dev libcurl4-openssl-dev libdbus-1-dev libdbus-glib-1-dev libgconf2-dev libgtk-3-dev libgtk2.0-dev libiw-dev libnotify-dev libpulse-dev libx11-xcb-dev libxt-dev mesa-common-dev python-dbus xvfb yasm
```
* Creamos los enlaces necesarios (fuera del chroot)

```sh
cd /usr/lib
ln -s /var/chroot/linux32/lib/i386-linux-gnu /lib/
ln -s /var/chroot/linux32/usr/lib/i386-linux-gnu /usr/lib/
ln -s /var/chroot/linux32/usr/include/i386-linux-gnu /usr/include/
```
Si anteriormente hemos instalado multilib o ya tenemos un entorno de cross-compiling estos ficheros es posible que ya existirán y no podamos crear los enlaces. En este caso puedes crearlos directamente en los directorios correspondientes (si es necesario).

* Añadimos la arquitectura i686 al compilador de Rust

```sh
rustup target add i686-unknown-linux-gnu
```
* Preparamos el fichero <i>mozconfig</i> para la compilación de i686
Para ello lo editamosy agregamos las siguientes lineas:

```sh
export PKG_CONFIG_PATH="/var/chroot/linux32/usr/lib/i386-linux-gnu/pkgconfig:/var/chroot/linux32/usr/share/pkgconfig"
export MOZ_LINUX_32_SSE2_STARTUP_ERROR=1
CFLAGS="$CFLAGS -msse -msse2 -mfpmath=sse"
CXXFLAGS="$CXXFLAGS -msse -msse2 -mfpmath=sse"
if test `uname -m` = "x86_64"; then
  CFLAGS="$CFLAGS -m32 -march=pentium-m"
  CXXFLAGS="$CXXFLAGS -m32 -march=pentium-m"
  ac_add_options --target=i686-pc-linux
  ac_add_options --host=i686-pc-linux
  ac_add_options --x-libraries=/usr/lib
fi
```
* Lanzamos la compilación

```sh
./mach configure
./mach build
```

Es importante señalar que puede que al compilar nos de un error el programa <i>nsinstall</i>. De ser así <b>debemos copiar la versión de 64 bits</b> del nsinstall al directorio <i>config</i> de las fuentes.

```sh
#Desde el directorio raíz de las fuentes del firefox
cp firefox-52.5.0esr/obj-x86_64-pc-linux-gnu/config/nsinstall config/
#volvemos a lanzar la compilacin y debería funcionar
./mach build
```

En este punto debería bastar con ejecutar 

```sh
./mach package
```
pero en nuestras pruebas fallaba y no conseguía acabar. Así que desoyendo las recomendaciones dadas por Mozilla copiamos el directorio donde estamos compilando firefox dentro del chroot, nos movemos al chroot e instalamos las dependencias que faltan ( <i>./mach configure</i> nos las irá cantando)</i> y lanzamos el empaquetado (puede ser necesario que antes debamos volver a compilar, siempre desde dentro del chroot):

```sh
#Por ejemplo lo copio al directorio root del chroot
cp %DIR_FIREFOX% /var/chroot/root -r
#Entramos al chroot
sudo schroot /var/chroot/linux32
#Dentro del chroot ->
cd /root
cd %DIR_FIREFOX%
./mach package
#En caso de error lanzamos la compilación y el package de nuevo
./mach build
./mach package
```

Con esto ya tendremos un directorio obj-firefox-i686-pc-linux-gnu con nuestras fuentes listas para ser empaquetadas.
Es importante tener en cuenta que puesto que hemos entrado al chroot como el usuario root debemos reasignar la propiedad de todos los ficheros del directorio de compilación a nuestro usuario local (chown -r ...)


## 7.- Empaquetado
Si has llegado hasta aquí conservando tu cordura e integridad moral es el momento de felicitarte, ya casi estamos...

Después de haber realizado la compilación tendremos dentro del directorio de las fuentes los directorios <i>obj-i686-pc-linux</i> y <i>obj-x86_64-pc-linux-gnu</i>. Estos son los directorios donde tenemos nuestro firefox compilado y empaquetado, listo para generar nuestro paquete.

* Del svn de lliurex-xenial nos bajamos el paquete firefox-esr
* Dentro del directorio de empaquetado reemplazamos el contenido del directorio firefox-i686 con el del directorio de la compilación obj-i686-pc-linux/dist/firefoxESR
* Haremos lo mismo con el directorio firefox-x86_64
* Dentro del directorio <i>llx-resources </i> tenemos el .desktop de la aplicación así como la metainformación para Lliurex-Store
* Dentro de firefox-common tenemos los ficheros de configuración para darle el último toque a nuestra instalación de firefox-esr. Estos ficheros son comunes a las versiones de amd64 e i386.

Una vez reemplazados los directorios con las fuentes compiladas y ajustada la información o las preferencias (de ser necesario) ya podemos subir nuestros cambios a subversión y generar el paquete como de costumbre.
