FROM bimspot/ifcopenshell:latest

RUN apt-get -qq update && apt-get -qq install -y wget unzip git inotify-tools


#COPY --from=ifcconvert /usr/bin/IfcConvert /usr/bin/IfcConvert
RUN ln -s /usr/lib/IfcConvert /usr/local/bin/IfcConvert

RUN wget --quiet https://github.com/KhronosGroup/COLLADA2GLTF/releases/download/v2.1.5/COLLADA2GLTF-v2.1.5-linux.zip
RUN unzip -q COLLADA2GLTF-v2.1.5-linux.zip -d /usr/lib/COLLADA2GLTF
RUN ln -s /usr/lib/COLLADA2GLTF/COLLADA2GLTF-bin /usr/local/bin/COLLADA2GLTF
RUN rm -rf COLLADA2GLTF-v2.1.5-linux.zip

RUN mkdir -p /scripts
COPY convertifc.sh /scripts
WORKDIR /scripts
RUN chmod +x convertifc.sh
CMD /scripts/convertifc.sh
