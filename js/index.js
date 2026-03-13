    //muj token
import { cesiumAccessToken, targetLocation } from "./cesiumConfig.js"
Cesium.Ion.defaultAccessToken = cesiumAccessToken
    //zalozni token
//Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNjRiMzhiMy05MDU2LTQ5YTMtOWNiNS05ZmY4MGQ1NWEwYjEiLCJpZCI6MzY2Njg2LCJpYXQiOjE3NjQ4NTcwNjZ9.0c3cqM9bq-ShqC6I-atyrHwf4ifnT-3qCqoYAjYfMkk';

// Initializace Cesium Viewer
    const viewer = new Cesium.Viewer('cesiumContainer', {
    infoBox: true,
    selectionIndicator: false,
    timeline: false,
    animation: false
}); 


// nastaveni kamery na zajmovou oblast
    viewer.camera.flyTo(targetLocation);


try {
    //vlastni teren
    viewer.scene.setTerrain(
        new Cesium.Terrain(
        Cesium.CesiumTerrainProvider.fromIonAssetId(4512526),
        ),
    );

    viewer.scene.globe.depthTestAgainstTerrain = true;

    //bodove mracno
    const mracno = await Cesium.Cesium3DTileset.fromIonAssetId(4504632);
    viewer.scene.primitives.add(mracno);
    mracno.pointCloudShading.attenuation = true; 

    //tereni deprese
    const deprese = await Cesium.IonResource.fromAssetId(4522619);
const dataSource = await Cesium.GeoJsonDataSource.load(deprese, {
            /*nastavení pro vykreslení polygonu jako 2D datové vrstvy
            clampToGround: true, // vykresleni polygonu na povrch
            fill: Cesium.Color.CYAN.withAlpha(0.5), // symbologie JSON */
        stroke: Cesium.Color.TRANSPARENT // Vypne hrany, aby to nevyhazovalo warning
    });

    const entities = dataSource.entities.values;
    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (entity.polygon) {
            // Vypnuti obrysu polygonu
            entity.polygon.outline = false;

            /*vykresleni polygonu pouze na teren
            entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN; */

            //zjisteni_rozmeru_lihniste
            let vyskaDna = entity.properties.DNO.getValue();
            let vyskaHladiny = entity.properties.HLADINA.getValue();
            //kompenzace vykresleni terenu
            let korekceTerenu = -0.4;
            //nastaveni absolutni vyskove hodnoty
            entity.polygon.heightReference = Cesium.HeightReference.NONE;
            entity.polygon.extrudedHeightReference = Cesium.HeightReference.NONE;
            //definice dna a vrchu polygonu
            entity.polygon.height = vyskaDna;
            entity.polygon.extrudedHeight = vyskaHladiny - 0.05;
            //symbologie polygonu
            entity.polygon.material = Cesium.Color.DEEPSKYBLUE.withAlpha(0.6);

            //uprava pop-up nadpisu
            let cisloTune = "";
            if (entity.properties.id) {
                cisloTune = entity.properties.id.getValue();
            } else {
                cisloTune = i + 1;
            }

            entity.name = "Tůň " + cisloTune;
        }
    }
    
    viewer.dataSources.add(dataSource);

    const checkboxDeprese = document.getElementById('toggleDeprese');
    if (checkboxDeprese) {
        checkboxDeprese.addEventListener('change', (event) => {
            let chciZobrazit = event.target.checked;
            
            if (chciZobrazit) {
                // Zkontrolujeme, zda už vrstva na mapě není, a pokud ne, přidáme ji ze "šuplíku"
                if (!viewer.dataSources.contains(dataSource)) {
                    viewer.dataSources.add(dataSource);
                }
            } else {
                // TOTO JE TO KOUZLO: Odebereme vrstvu z mapy. 
                // To slůvko 'false' na konci je extrémně důležité! Říká Cesiu: 
                // "Nesmaž ta data úplně, jen je dej stranou, ještě je budeme potřebovat."
                viewer.dataSources.remove(dataSource, false); 
            }
        });
    }

    const checkboxMracno = document.getElementById('toggleMracno');
    if (checkboxMracno) {
    checkboxMracno.addEventListener('change', (event) => {
        mracno.show = event.target.checked;
        });
    } else {
        console.warn("Tlačítko toggleMracno chybí v HTML!")
    }




} catch (error) {
    console.error("Chyba při načítání dat z Ionu:", error);
}
