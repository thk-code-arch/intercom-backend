#!/bin/sh

MONITORDIR="/files/input"
OUTPUTDIR="/files/output"

inotifywait -m -e moved_to -e create "$MONITORDIR" --format "%f" | while read f
do
	mv "${MONITORDIR}/${f}" "${OUTPUTDIR}/${f}"
	echo "Converting IFC to DAE" | tee "${OUTPUTDIR}/${f%.*}.log"
	IfcConvert -v -y --use-element-guids "${OUTPUTDIR}/${f%.*}.ifc" "${OUTPUTDIR}/${f%.*}.dae" | tee -a "${OUTPUTDIR}/${f%.*}.log"
	echo "Converting DAE to glTF" | tee -a "${OUTPUTDIR}/${f%.*}.log"
	COLLADA2GLTF -v -i "${OUTPUTDIR}/${f%.*}.dae" -o "${OUTPUTDIR}/${f%.*}.gltf" | tee -a "${OUTPUTDIR}/${f%.*}.log"
	rm "${OUTPUTDIR}/${f%.*}.ifc"
	rm "${OUTPUTDIR}/${f%.*}.dae"
done
