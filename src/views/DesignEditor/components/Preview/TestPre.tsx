import React, { useState } from "react";

interface Scene {
  id: string;
  preview: string;
  layers: Layer[];
}

interface Layer {
  id: string;
  src: string;
  preview: string;
}

const Testv2 = () => {
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: "scene1",
      preview: "",
      layers: [
        {
            "id": "background",
            "name": "Initial Frame",
            "angle": 0,
            "stroke": null,
            "strokeWidth": 0,
            "left": 0,
            "top": 0,
            "width": 1200,
            "height": 1200,
            "opacity": 1,
            "originX": "left",
            "originY": "top",
            "scaleX": 1,
            "scaleY": 1,
            "type": "Background",
            "flipX": false,
            "flipY": false,
            "skewX": 0,
            "skewY": 0,
            "visible": true,
            "shadow": {
                "color": "#fcfcfc",
                "blur": 4,
                "offsetX": 0,
                "offsetY": 0,
                "affectStroke": false,
                "nonScaling": false
            },
            "fill": "#ffffff",
            "metadata": {}
        },
        {
            "id": "m1SiMNQBihuwUdsilE_Ou",
            "name": "StaticImage",
            "angle": 0,
            "stroke": null,
            "strokeWidth": 0,
            "left": 0,
            "top": 0,
            "width": 640,
            "height": 640,
            "opacity": 1,
            "originX": "left",
            "originY": "top",
            "scaleX": 1.88,
            "scaleY": 1.88,
            "type": "BackgroundImage",
            "flipX": false,
            "flipY": false,
            "skewX": 0,
            "skewY": 0,
            "visible": true,
            "shadow": null,
            "src": "blob:http://127.0.0.1:5174/0c8a4c79-c85c-4bcc-8392-c16aae9139d5",
            "cropX": 0,
            "cropY": 0,
            "metadata": {}
        },
        {
            "id": "9XzOh-i8pqTfi4QtHxEac",
            "name": "StaticImage",
            "angle": 0,
            "stroke": null,
            "strokeWidth": 0,
            "left": -17.310000000000002,
            "top": 907.95,
            "width": 1249,
            "height": 1061,
            "opacity": 1,
            "originX": "left",
            "originY": "top",
            "scaleX": 0.33,
            "scaleY": 0.33,
            "type": "StaticImage",
            "flipX": false,
            "flipY": false,
            "skewX": 0,
            "skewY": 0,
            "visible": true,
            "shadow": null,
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Flag_map_of_Cambodia.svg/1249px-Flag_map_of_Cambodia.svg.png",
            "cropX": 0,
            "cropY": 0,
            "metadata": {}
        }
      ],
    },
  ]);

  const [uploads, setUploads] = useState<File[]>([]);

  const handleDropFiles = (files: FileList) => {
    setUploads([...uploads, ...Array.from(files)]);
  };

  const handleUpload = async () => {
    const newScenes = scenes.map((scene) => {
      if (scene.id === "lHGuDKUXixv9Zce4de16X") {
        const newLayers = scene.layers.map(async (layer, index) => {
          if (index === 1) {
            const file = uploads[0];
            const blob = await fileToBlob(file);
            const src = URL.createObjectURL(blob);
            return {
              ...layer,
              src,
            };
          } else {
            return layer;
          }
        });
        return {
          ...scene,
          layers: newLayers,
        };
      } else {
        return scene;
      }
    });
    // @ts-ignore
    setScenes(newScenes);
    setUploads([]);
  };
  const fileToBlob = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
        resolve(blob);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };
//   handle replace all uploaded images to scene.layers[1] 
const handleReplace = async () => {
    const newScenes = scenes.map((scene) => {
        if (scene.id === "lHGuDKUXixv9Zce4de16X") {
            const newLayers = scene.layers.map(async (layer, index) => {
            if (index === 1) {
                const file = uploads[0];
                const blob = await fileToBlob(file);
                const src = URL.createObjectURL(blob);
                return {
                ...layer,
                src,
                };
            } else {
                return layer;
            }
            });
            return {
            ...scene,
            layers: newLayers,
            };
        } else {
            return scene;
        }
        }
    );
    // @ts-ignore
    setScenes(newScenes);
    setUploads([]);
    };
    console.log(scenes);


  return (
    <div>
      <div>
        <input type="file" multiple onChange={(e) => handleDropFiles(e.target.files!)} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <div>
        
      </div>
      <div>
      {scenes.map((scene) => {
        return (
          <div>
            {scene.layers.map((layer) => {
              if (layer.type === "StaticImage") {
                return <img src={layer.src} alt="" />;
              } else {
                return null;
              }
            })}
          </div>
        );
        })

      }
      </div>
    </div>
  );
};

export default Testv2;