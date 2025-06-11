(function (React, designSystem) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  /*import React, { useState, useEffect } from 'react';
  import { Box, Button, Text, Input, Link } from '@adminjs/design-system';
  import { BasePropertyProps } from 'adminjs'; // Pour le typage des props, même si non strict en JS

  const PhotoUploadComponent = (props) => {
    const { record, property, onChange } = props; // record: l'enregistrement actuel, property: la définition de la colonne
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState(record.params[property.name] || ''); // Récupère l'URL existante

    // Effet pour mettre à jour l'image si le record change (ex: après un save)
    useEffect(() => {
      setImageUrl(record.params[property.name] || '');
    }, [record.params[property.name]]);


    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
      setMessage(''); // Efface les messages précédents
    };

    const handleUpload = async () => {
      if (!file) {
        setMessage('Veuillez sélectionner un fichier.');
        return;
      }

      if (!record.id) {
        setMessage('Erreur: ID de l\'enregistrement manquant. Veuillez sauvegarder l\'enregistrement d\'abord.');
        return;
      }

      const formData = new FormData();
      formData.append('photo', file); // 'photo' doit correspondre au 'name' dans multerConfig.js et UploadAdminController.js
      formData.append('itemId', record.id); // Ajoute l'ID de l'enregistrement

      try {
        // Appel à ton endpoint d'upload Multer
        const response = await fetch('/admin/upload-photo', {
          method: 'POST',
          body: formData,
        });

        // Vérifie si la réponse n'est pas OK et lance une erreur si c'est le cas
        if (!response.ok) {
          const errorText = await response.text(); // Tente de lire la réponse comme du texte
          throw new Error(errorText || `Erreur HTTP: ${response.status}`);
        }

        // La réponse réussie est une page HTML. Nous ne la traitons pas directement ici.
        // Au lieu de ça, on se base sur le succès de la requête HTTP
        // et on rafraîchit le champ dans AdminJS pour que le backend mette à jour le chemin de l'image.

        setMessage('Upload réussi ! La page sera rafraîchie.');
        // Mettre à jour l'URL affichée, même si le backend va rafraîchir
        setImageUrl('/uploads/images/' + file.name); // Ce n'est pas le nom final unique, mais un indicateur
        setFile(null); // Réinitialise le champ de fichier

        // Déclencher un changement dans AdminJS pour qu'il puisse rafraîchir la vue ou la propriété
        // C'est important pour que la valeur du champ 'photo' soit mise à jour dans l'interface AdminJS
        // Cela force aussi un rechargement du record, ce qui mettra à jour l'imageUrl
        onChange(property.name, imageUrl); // Passe une valeur "provisoire" pour déclencher le refresh. La vraie valeur viendra du backend.


      } catch (error) {
        console.error('Erreur lors de l\'upload :', error);
        setMessage(`Erreur lors de l'upload : ${error.message}`);
      }
    };

    // Affiche l'ID de l'enregistrement pour le débogage ou l'information
    const recordId = record.id;
    const displayId = recordId ? `ID: ${recordId}` : 'ID: N/A (veuillez sauvegarder l\'enregistrement)';

    return (
      <Box mb="xl">
        <Text fontWeight="bold" mb="sm">{property.label || 'Photo'}</Text>
        <Text mt="sm" mb="sm" fontStyle="italic">
          {displayId}
        </Text>

        {imageUrl && (
          <Box mb="md">
            <Text fontSize="sm" color="gray60">Image actuelle:</Text>
            <img src={imageUrl} alt="Image actuelle" style={{ maxWidth: '200px', height: 'auto', borderRadius: '4px', marginTop: '8px' }} />
            <Text fontSize="xs" color="gray40">{imageUrl}</Text>
          </Box>
        )}

        <Input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginBottom: '10px' }}
        />
        <Button onClick={handleUpload} disabled={!file || !record.id}>
          Uploader la photo
        </Button>

        {message && (
          <Text mt="md" color={message.includes('succès') ? 'success' : 'danger'}>
            {message}
          </Text>
        )}

        <Text mt="md" fontSize="sm" color="gray60">
          Note: L'upload remplace l'image existante. Le chemin sera mis à jour en base de données.
        </Text>
      </Box>
    );
  };

  export default PhotoUploadComponent;*/

  const PhotoUploadComponent = props => {
    console.log("PhotoUploadComponent received props:", props);
    // MODIFICATION ICI : Incluez 'resource' dans la destructuration des props
    const {
      record,
      property,
      onChange,
      resource
    } = props;
    const [file, setFile] = React.useState(null);
    const [message, setMessage] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState(record.params[property.name] || '');
    const [isUploading, setIsUploading] = React.useState(false);
    const buttonRef = React.useRef(null);
    React.useEffect(() => {
      console.log("PhotoUploadComponent: useEffect triggered. Current image URL:", record.params[property.name]);
      setImageUrl(record.params[property.name] || '');

      // AJOUT D'UN LISTENER D'ÉVÉNEMENT DIRECT SUR LE DOM POUR DÉBOGAGE
      if (buttonRef.current) {
        const currentButton = buttonRef.current;
        const handleClickDebug = event => {
          console.log("DEBUG: Clic direct sur le bouton DOM détecté!", event);
        };
        currentButton.addEventListener('click', handleClickDebug);
        return () => {
          currentButton.removeEventListener('click', handleClickDebug);
        };
      }
    }, [record.params[property.name], record.id]);
    const handleFileChange = event => {
      const selectedFile = event.target.files[0];
      console.log("handleFileChange: Fichier sélectionné:", selectedFile);
      setFile(selectedFile);
      setMessage('');
      if (selectedFile) {
        const previewUrl = URL.createObjectURL(selectedFile);
        console.log("handleFileChange: Génération de la prévisualisation URL:", previewUrl);
        setImageUrl(previewUrl);
      } else {
        console.log("handleFileChange: Aucun fichier sélectionné, réinitialisation de la prévisualisation.");
        setImageUrl(record.params[property.name] || '');
      }
    };
    const handleUpload = async () => {
      console.log("handleUpload: Début de l'exécution.");
      // MODIFICATION ICI : Utilisez resource.id au lieu de record.resourceId
      console.log("handleUpload: record.id =", record.id, "resource.id =", resource.id);
      if (!file) {
        setMessage('Veuillez sélectionner un fichier avant d\'uploader.');
        console.log("handleUpload: Validation échouée - Aucun fichier sélectionné.");
        return;
      }
      if (!record.id) {
        setMessage('Erreur: Enregistrement non sauvegardé. Veuillez d\'abord créer/sauvegarder l\'enregistrement pour obtenir un ID.');
        console.log("handleUpload: Validation échouée - ID de l'enregistrement manquant (record.id est null/undefined).");
        return;
      }
      // MODIFICATION ICI : Utilisez resource.id pour la validation
      if (!resource.id) {
        setMessage('Erreur: Type de ressource manquant.');
        console.log("handleUpload: Validation échouée - Type de ressource (resource.id) manquant.");
        return;
      }
      setIsUploading(true);
      setMessage('Téléchargement en cours...');
      console.log("handleUpload: isUploading défini à true, message affiché.");
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('itemId', record.id);
      // MODIFICATION ICI : Utilisez resource.id pour FormData
      formData.append('resourceId', resource.id);
      console.log("handleUpload: FormData préparé avec photo, itemId:", record.id, "et resourceId:", resource.id);
      try {
        console.log("handleUpload: Envoi de la requête fetch POST à /admin/upload-photo...");
        const response = await fetch('/admin/upload-photo', {
          method: 'POST',
          body: formData
        });
        console.log("handleUpload: Requête fetch terminée. Statut de la réponse HTTP:", response.status, "URL de la réponse:", response.url);
        const data = await response.json();
        console.log("handleUpload: Réponse JSON du serveur:", data);
        if (response.ok && data.success) {
          setMessage('Upload réussi ! La page sera mise à jour au prochain rafraîchissement ou sauvegarde.');
          console.log("handleUpload: Succès de l'upload. Nouvelle URL de l'image:", data.imageUrl);
          setImageUrl(data.imageUrl);
          setFile(null);
          onChange(property.name, data.imageUrl);
          console.log("handleUpload: onChange appelé pour mettre à jour la propriété AdminJS avec:", data.imageUrl);
        } else {
          const errorMessage = data.message || `Erreur HTTP: ${response.status} (Pas de message spécifique)`;
          setMessage(`Erreur lors de l'upload : ${errorMessage}`);
          console.error("handleUpload: Échec de l'upload. Message d'erreur:", errorMessage);
        }
      } catch (error) {
        console.error('handleUpload: Erreur critique (réseau ou JSON invalide) lors de l\'upload ou du traitement de la réponse :', error);
        setMessage(`Erreur lors de l'upload (réseau/serveur) : ${error.message}. Vérifiez la console.`);
      } finally {
        setIsUploading(false);
        console.log("handleUpload: Fin de l'exécution (finally), isUploading défini à false.");
      }
    };
    const recordId = record.id;
    const displayId = recordId ? `ID: ${recordId}` : 'ID: N/A (créez/sauvegardez d\'abord)';
    // MODIFICATION ICI : Utilisez resource.id pour l'affichage de débogage
    const resourceIdentifier = resource.id ? `Ressource: ${resource.id}` : '';
    // MODIFICATION ICI : Utilisez resource.id pour le log de rendu
    console.log("PhotoUploadComponent: Render. Current record ID:", recordId, "Resource ID:", resource.id);
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontWeight: "bold",
      mb: "sm"
    }, property.label || 'Photo'), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "sm",
      mb: "sm",
      fontStyle: "italic"
    }, displayId, " ", resourceIdentifier && `(${resourceIdentifier})`), imageUrl && /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "md"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontSize: "sm",
      color: "gray60"
    }, "Image actuelle:"), /*#__PURE__*/React__default.default.createElement("img", {
      src: imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`,
      alt: "Image actuelle",
      style: {
        maxWidth: '200px',
        height: 'auto',
        borderRadius: '4px',
        marginTop: '8px'
      }
    }), imageUrl.startsWith('/') ? /*#__PURE__*/React__default.default.createElement(designSystem.Link, {
      href: imageUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      fontSize: "xs",
      color: "gray40"
    }, imageUrl) : /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontSize: "xs",
      color: "gray40"
    }, imageUrl)), /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
      type: "file",
      onChange: handleFileChange,
      accept: "image/*",
      style: {
        marginBottom: '10px'
      }
    }), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      ref: buttonRef,
      type: "button",
      onClick: handleUpload,
      disabled: !file || !record.id || isUploading,
      variant: "primary"
    }, isUploading ? 'Téléchargement...' : 'Uploader la photo'), message && /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "md",
      color: message.includes('réussi') ? 'success' : 'danger'
    }, message), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "md",
      fontSize: "sm",
      color: "gray60"
    }, "Note: L'upload remplace l'image existante. Le chemin sera mis \xE0 jour en base de donn\xE9es apr\xE8s sauvegarde."));
  };

  /*import React from 'react'
  import { BasePropertyProps } from 'adminjs'
  import { Label, Box, DropZone } from '@adminjs/design-system'

  const PDFUploadComponent = (props) => {
    const { onChange, property, record } = props

    const uploadedFile = record.params?.[property.name]

    const handleUpload = async (files) => {
      const formData = new FormData()
      formData.append('pdf', files[0])  // <-- clé corrigée ici : 'pdf'

      const response = await fetch('/upload/pdf', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.filename) {
        onChange(property.name, data.filename)
      }
    }

    return (
      <Box>
        <Label>{property.label}</Label>
        <DropZone
          onChange={(files) => handleUpload(files)}
          accept=".pdf"
        />
        {uploadedFile && (
          <p style={{ marginTop: '10px' }}>
            Fichier actuel : <strong>{uploadedFile}</strong>
          </p>
        )}
      </Box>
    )
  }

  export default PDFUploadComponent*/
  const PDFUploadComponent = props => {
    const {
      onChange,
      property,
      record
    } = props;
    const uploadedFile = record.params?.[property.name];
    const handleUpload = async files => {
      const formData = new FormData();
      formData.append('pdf', files[0]); // ✅ très important

      try {
        const response = await fetch('http://localhost:3033/admin/upload/pdf', {
          // <-- URL complète et correcte
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.filename) {
          console.log('PDF upload success:', data.filename);
          onChange(property.name, data.filename); // ✅ très important : on met à jour le champ avec le nom du fichier
        } else {
          console.error('PDF upload failed:', data);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, property.label), /*#__PURE__*/React__default.default.createElement(designSystem.DropZone, {
      onChange: files => handleUpload(files),
      accept: ".pdf"
    }), uploadedFile && /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        marginTop: '10px'
      }
    }, "Fichier actuel : ", /*#__PURE__*/React__default.default.createElement("strong", null, uploadedFile)));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.MyPhotoUploadComponent = PhotoUploadComponent;
  AdminJS.UserComponents.PDFUploadComponent = PDFUploadComponent;

})(React, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9BZG1pbi9jb21wb25lbnRzL1Bob3RvVXBsb2FkQ29tcG9uZW50LmpzeCIsIi4uL0FkbWluL2NvbXBvbmVudHMvUERGVXBsb2FkQ29tcG9uZW50LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgVGV4dCwgSW5wdXQsIExpbmsgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IEJhc2VQcm9wZXJ0eVByb3BzIH0gZnJvbSAnYWRtaW5qcyc7IC8vIFBvdXIgbGUgdHlwYWdlIGRlcyBwcm9wcywgbcOqbWUgc2kgbm9uIHN0cmljdCBlbiBKU1xuXG5jb25zdCBQaG90b1VwbG9hZENvbXBvbmVudCA9IChwcm9wcykgPT4ge1xuICBjb25zdCB7IHJlY29yZCwgcHJvcGVydHksIG9uQ2hhbmdlIH0gPSBwcm9wczsgLy8gcmVjb3JkOiBsJ2VucmVnaXN0cmVtZW50IGFjdHVlbCwgcHJvcGVydHk6IGxhIGTDqWZpbml0aW9uIGRlIGxhIGNvbG9ubmVcbiAgY29uc3QgW2ZpbGUsIHNldEZpbGVdID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFttZXNzYWdlLCBzZXRNZXNzYWdlXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2ltYWdlVXJsLCBzZXRJbWFnZVVybF0gPSB1c2VTdGF0ZShyZWNvcmQucGFyYW1zW3Byb3BlcnR5Lm5hbWVdIHx8ICcnKTsgLy8gUsOpY3Vww6hyZSBsJ1VSTCBleGlzdGFudGVcblxuICAvLyBFZmZldCBwb3VyIG1ldHRyZSDDoCBqb3VyIGwnaW1hZ2Ugc2kgbGUgcmVjb3JkIGNoYW5nZSAoZXg6IGFwcsOocyB1biBzYXZlKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldEltYWdlVXJsKHJlY29yZC5wYXJhbXNbcHJvcGVydHkubmFtZV0gfHwgJycpO1xuICB9LCBbcmVjb3JkLnBhcmFtc1twcm9wZXJ0eS5uYW1lXV0pO1xuXG5cbiAgY29uc3QgaGFuZGxlRmlsZUNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgIHNldEZpbGUoZXZlbnQudGFyZ2V0LmZpbGVzWzBdKTtcbiAgICBzZXRNZXNzYWdlKCcnKTsgLy8gRWZmYWNlIGxlcyBtZXNzYWdlcyBwcsOpY8OpZGVudHNcbiAgfTtcblxuICBjb25zdCBoYW5kbGVVcGxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICBzZXRNZXNzYWdlKCdWZXVpbGxleiBzw6lsZWN0aW9ubmVyIHVuIGZpY2hpZXIuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFyZWNvcmQuaWQpIHtcbiAgICAgIHNldE1lc3NhZ2UoJ0VycmV1cjogSUQgZGUgbFxcJ2VucmVnaXN0cmVtZW50IG1hbnF1YW50LiBWZXVpbGxleiBzYXV2ZWdhcmRlciBsXFwnZW5yZWdpc3RyZW1lbnQgZFxcJ2Fib3JkLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdwaG90bycsIGZpbGUpOyAvLyAncGhvdG8nIGRvaXQgY29ycmVzcG9uZHJlIGF1ICduYW1lJyBkYW5zIG11bHRlckNvbmZpZy5qcyBldCBVcGxvYWRBZG1pbkNvbnRyb2xsZXIuanNcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2l0ZW1JZCcsIHJlY29yZC5pZCk7IC8vIEFqb3V0ZSBsJ0lEIGRlIGwnZW5yZWdpc3RyZW1lbnRcblxuICAgIHRyeSB7XG4gICAgICAvLyBBcHBlbCDDoCB0b24gZW5kcG9pbnQgZCd1cGxvYWQgTXVsdGVyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYWRtaW4vdXBsb2FkLXBob3RvJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KTtcblxuICAgICAgLy8gVsOpcmlmaWUgc2kgbGEgcsOpcG9uc2Ugbidlc3QgcGFzIE9LIGV0IGxhbmNlIHVuZSBlcnJldXIgc2kgYydlc3QgbGUgY2FzXG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGNvbnN0IGVycm9yVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTsgLy8gVGVudGUgZGUgbGlyZSBsYSByw6lwb25zZSBjb21tZSBkdSB0ZXh0ZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JUZXh0IHx8IGBFcnJldXIgSFRUUDogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICB9XG5cbiAgICAgIC8vIExhIHLDqXBvbnNlIHLDqXVzc2llIGVzdCB1bmUgcGFnZSBIVE1MLiBOb3VzIG5lIGxhIHRyYWl0b25zIHBhcyBkaXJlY3RlbWVudCBpY2kuXG4gICAgICAvLyBBdSBsaWV1IGRlIMOnYSwgb24gc2UgYmFzZSBzdXIgbGUgc3VjY8OocyBkZSBsYSByZXF1w6p0ZSBIVFRQXG4gICAgICAvLyBldCBvbiByYWZyYcOuY2hpdCBsZSBjaGFtcCBkYW5zIEFkbWluSlMgcG91ciBxdWUgbGUgYmFja2VuZCBtZXR0ZSDDoCBqb3VyIGxlIGNoZW1pbiBkZSBsJ2ltYWdlLlxuXG4gICAgICBzZXRNZXNzYWdlKCdVcGxvYWQgcsOpdXNzaSAhIExhIHBhZ2Ugc2VyYSByYWZyYcOuY2hpZS4nKTtcbiAgICAgIC8vIE1ldHRyZSDDoCBqb3VyIGwnVVJMIGFmZmljaMOpZSwgbcOqbWUgc2kgbGUgYmFja2VuZCB2YSByYWZyYcOuY2hpclxuICAgICAgc2V0SW1hZ2VVcmwoJy91cGxvYWRzL2ltYWdlcy8nICsgZmlsZS5uYW1lKTsgLy8gQ2Ugbidlc3QgcGFzIGxlIG5vbSBmaW5hbCB1bmlxdWUsIG1haXMgdW4gaW5kaWNhdGV1clxuICAgICAgc2V0RmlsZShudWxsKTsgLy8gUsOpaW5pdGlhbGlzZSBsZSBjaGFtcCBkZSBmaWNoaWVyXG5cbiAgICAgIC8vIETDqWNsZW5jaGVyIHVuIGNoYW5nZW1lbnQgZGFucyBBZG1pbkpTIHBvdXIgcXUnaWwgcHVpc3NlIHJhZnJhw65jaGlyIGxhIHZ1ZSBvdSBsYSBwcm9wcmnDqXTDqVxuICAgICAgLy8gQydlc3QgaW1wb3J0YW50IHBvdXIgcXVlIGxhIHZhbGV1ciBkdSBjaGFtcCAncGhvdG8nIHNvaXQgbWlzZSDDoCBqb3VyIGRhbnMgbCdpbnRlcmZhY2UgQWRtaW5KU1xuICAgICAgLy8gQ2VsYSBmb3JjZSBhdXNzaSB1biByZWNoYXJnZW1lbnQgZHUgcmVjb3JkLCBjZSBxdWkgbWV0dHJhIMOgIGpvdXIgbCdpbWFnZVVybFxuICAgICAgb25DaGFuZ2UocHJvcGVydHkubmFtZSwgaW1hZ2VVcmwpOyAvLyBQYXNzZSB1bmUgdmFsZXVyIFwicHJvdmlzb2lyZVwiIHBvdXIgZMOpY2xlbmNoZXIgbGUgcmVmcmVzaC4gTGEgdnJhaWUgdmFsZXVyIHZpZW5kcmEgZHUgYmFja2VuZC5cblxuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0VycmV1ciBsb3JzIGRlIGxcXCd1cGxvYWQgOicsIGVycm9yKTtcbiAgICAgIHNldE1lc3NhZ2UoYEVycmV1ciBsb3JzIGRlIGwndXBsb2FkIDogJHtlcnJvci5tZXNzYWdlfWApO1xuICAgIH1cbiAgfTtcblxuICAvLyBBZmZpY2hlIGwnSUQgZGUgbCdlbnJlZ2lzdHJlbWVudCBwb3VyIGxlIGTDqWJvZ2FnZSBvdSBsJ2luZm9ybWF0aW9uXG4gIGNvbnN0IHJlY29yZElkID0gcmVjb3JkLmlkO1xuICBjb25zdCBkaXNwbGF5SWQgPSByZWNvcmRJZCA/IGBJRDogJHtyZWNvcmRJZH1gIDogJ0lEOiBOL0EgKHZldWlsbGV6IHNhdXZlZ2FyZGVyIGxcXCdlbnJlZ2lzdHJlbWVudCknO1xuXG4gIHJldHVybiAoXG4gICAgPEJveCBtYj1cInhsXCI+XG4gICAgICA8VGV4dCBmb250V2VpZ2h0PVwiYm9sZFwiIG1iPVwic21cIj57cHJvcGVydHkubGFiZWwgfHwgJ1Bob3RvJ308L1RleHQ+XG4gICAgICA8VGV4dCBtdD1cInNtXCIgbWI9XCJzbVwiIGZvbnRTdHlsZT1cIml0YWxpY1wiPlxuICAgICAgICB7ZGlzcGxheUlkfVxuICAgICAgPC9UZXh0PlxuXG4gICAgICB7aW1hZ2VVcmwgJiYgKFxuICAgICAgICA8Qm94IG1iPVwibWRcIj5cbiAgICAgICAgICA8VGV4dCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmF5NjBcIj5JbWFnZSBhY3R1ZWxsZTo8L1RleHQ+XG4gICAgICAgICAgPGltZyBzcmM9e2ltYWdlVXJsfSBhbHQ9XCJJbWFnZSBhY3R1ZWxsZVwiIHN0eWxlPXt7IG1heFdpZHRoOiAnMjAwcHgnLCBoZWlnaHQ6ICdhdXRvJywgYm9yZGVyUmFkaXVzOiAnNHB4JywgbWFyZ2luVG9wOiAnOHB4JyB9fSAvPlxuICAgICAgICAgIDxUZXh0IGZvbnRTaXplPVwieHNcIiBjb2xvcj1cImdyYXk0MFwiPntpbWFnZVVybH08L1RleHQ+XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cblxuICAgICAgPElucHV0XG4gICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZpbGVDaGFuZ2V9XG4gICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxuICAgICAgICBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICcxMHB4JyB9fVxuICAgICAgLz5cbiAgICAgIDxCdXR0b24gb25DbGljaz17aGFuZGxlVXBsb2FkfSBkaXNhYmxlZD17IWZpbGUgfHwgIXJlY29yZC5pZH0+XG4gICAgICAgIFVwbG9hZGVyIGxhIHBob3RvXG4gICAgICA8L0J1dHRvbj5cblxuICAgICAge21lc3NhZ2UgJiYgKFxuICAgICAgICA8VGV4dCBtdD1cIm1kXCIgY29sb3I9e21lc3NhZ2UuaW5jbHVkZXMoJ3N1Y2PDqHMnKSA/ICdzdWNjZXNzJyA6ICdkYW5nZXInfT5cbiAgICAgICAgICB7bWVzc2FnZX1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgKX1cblxuICAgICAgPFRleHQgbXQ9XCJtZFwiIGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyYXk2MFwiPlxuICAgICAgICBOb3RlOiBMJ3VwbG9hZCByZW1wbGFjZSBsJ2ltYWdlIGV4aXN0YW50ZS4gTGUgY2hlbWluIHNlcmEgbWlzIMOgIGpvdXIgZW4gYmFzZSBkZSBkb25uw6llcy5cbiAgICAgIDwvVGV4dD5cbiAgICA8L0JveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBob3RvVXBsb2FkQ29tcG9uZW50OyovXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vMmVtZSBjb2RlLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyppbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBUZXh0LCBJbnB1dCwgTGluayB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5UHJvcHMgfSBmcm9tICdhZG1pbmpzJzsgLy8gUG91ciBsZSB0eXBhZ2UgZGVzIHByb3BzLCBtw6ptZSBzaSBub24gc3RyaWN0IGVuIEpTXG5cbmNvbnN0IFBob3RvVXBsb2FkQ29tcG9uZW50ID0gKHByb3BzKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkLCBwcm9wZXJ0eSwgb25DaGFuZ2UgfSA9IHByb3BzOyAvLyByZWNvcmQ6IGwnZW5yZWdpc3RyZW1lbnQgYWN0dWVsLCBwcm9wZXJ0eTogbGEgZMOpZmluaXRpb24gZGUgbGEgY29sb25uZVxuICBjb25zdCBbZmlsZSwgc2V0RmlsZV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUoJycpO1xuICAvLyBVdGlsaXNlIHByb3BlcnR5Lm5hbWUgKGV4OiAncGhvdG8nIG91ICdpbWFnZScpIHBvdXIgYWNjw6lkZXIgw6AgbGEgdmFsZXVyIGNvcnJlY3RlXG4gIGNvbnN0IFtpbWFnZVVybCwgc2V0SW1hZ2VVcmxdID0gdXNlU3RhdGUocmVjb3JkLnBhcmFtc1twcm9wZXJ0eS5uYW1lXSB8fCAnJyk7XG5cbiAgLy8gRWZmZXQgcG91ciBtZXR0cmUgw6Agam91ciBsJ2ltYWdlIHNpIGxlIHJlY29yZCBjaGFuZ2UgKGV4OiBhcHLDqHMgdW4gc2F2ZSBvdSB1biByZWZyZXNoKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldEltYWdlVXJsKHJlY29yZC5wYXJhbXNbcHJvcGVydHkubmFtZV0gfHwgJycpO1xuICB9LCBbcmVjb3JkLnBhcmFtc1twcm9wZXJ0eS5uYW1lXV0pO1xuXG5cbiAgY29uc3QgaGFuZGxlRmlsZUNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgIHNldEZpbGUoZXZlbnQudGFyZ2V0LmZpbGVzWzBdKTtcbiAgICBzZXRNZXNzYWdlKCcnKTsgLy8gRWZmYWNlIGxlcyBtZXNzYWdlcyBwcsOpY8OpZGVudHNcbiAgfTtcblxuICBjb25zdCBoYW5kbGVVcGxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICBzZXRNZXNzYWdlKCdWZXVpbGxleiBzw6lsZWN0aW9ubmVyIHVuIGZpY2hpZXIuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gcmVjb3JkLmlkIGV0IHJlY29yZC5yZXNvdXJjZUlkIHNvbnQgZGVzIHByb3BzIGZvdXJuaWVzIHBhciBBZG1pbkpTXG4gICAgaWYgKCFyZWNvcmQuaWQpIHtcbiAgICAgIHNldE1lc3NhZ2UoJ0VycmV1cjogSUQgZGUgbFxcJ2VucmVnaXN0cmVtZW50IG1hbnF1YW50LiBWZXVpbGxleiBzYXV2ZWdhcmRlciBsXFwnZW5yZWdpc3RyZW1lbnQgZFxcJ2Fib3JkLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXJlY29yZC5yZXNvdXJjZUlkKSB7XG4gICAgICBzZXRNZXNzYWdlKCdFcnJldXI6IFR5cGUgZGUgcmVzc291cmNlIG1hbnF1YW50LicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdwaG90bycsIGZpbGUpOyAvLyAncGhvdG8nIGNvcnJlc3BvbmQgYXUgJ25hbWUnIGRhbnMgbXVsdGVyQ29uZmlnLmpzIGV0IFVwbG9hZEFkbWluQ29udHJvbGxlci5qc1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnaXRlbUlkJywgcmVjb3JkLmlkKTsgLy8gTCdJRCBkZSBsJ2VucmVnaXN0cmVtZW50IChleDogSUQgZGUgbCd1dGlsaXNhdGV1ciwgZGUgbGEgbWF0acOocmUpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdyZXNvdXJjZUlkJywgcmVjb3JkLnJlc291cmNlSWQpOyAvLyBMZSBub20gZGUgbGEgcmVzc291cmNlIEFkbWluSlMgKGV4OiAndXRpbGlzYXRldXJzJywgJ21hdGllcmVzJylcblxuICAgIHRyeSB7XG4gICAgICAvLyBBcHBlbCDDoCB0b24gZW5kcG9pbnQgZCd1cGxvYWQgTXVsdGVyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYWRtaW4vdXBsb2FkLXBob3RvJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KTtcblxuICAgICAgLy8gLS0tIE5PVVZFQVUgOiBUcmFpdGVtZW50IGRlIGxhIHLDqXBvbnNlIEpTT04gZHUgc2VydmV1ciAtLS1cbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7IC8vIFRlbnRlIGRlIHBhcnNlciBsYSByw6lwb25zZSBjb21tZSBkdSBKU09OXG5cbiAgICAgIGlmIChyZXNwb25zZS5vayAmJiBkYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgLy8gTCd1cGxvYWQgYSByw6l1c3NpXG4gICAgICAgIHNldE1lc3NhZ2UoJ1VwbG9hZCByw6l1c3NpICEnKTtcbiAgICAgICAgLy8gTWV0IMOgIGpvdXIgbCdVUkwgZGUgbCdpbWFnZSBhZmZpY2jDqWUgYXZlYyBjZWxsZSByZW52b3nDqWUgcGFyIGxlIHNlcnZldXJcbiAgICAgICAgc2V0SW1hZ2VVcmwoZGF0YS5pbWFnZVVybCk7XG4gICAgICAgIHNldEZpbGUobnVsbCk7IC8vIFLDqWluaXRpYWxpc2UgbGUgY2hhbXAgZGUgZmljaGllclxuXG4gICAgICAgIC8vIETDqWNsZW5jaGVyIHVuIGNoYW5nZW1lbnQgZGFucyBBZG1pbkpTIGF2ZWMgbGEgbm91dmVsbGUgVVJMIHLDqWVsbGVcbiAgICAgICAgLy8gQydlc3QgaW1wb3J0YW50IHBvdXIgcXVlIGxhIHZhbGV1ciBkdSBjaGFtcCBzb2l0IG1pc2Ugw6Agam91ciBkYW5zIGwnaW50ZXJmYWNlIGV0IGVucmVnaXN0csOpZVxuICAgICAgICBvbkNoYW5nZShwcm9wZXJ0eS5uYW1lLCBkYXRhLmltYWdlVXJsKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTCd1cGxvYWQgYSDDqWNob3XDqSBzZWxvbiBsYSByw6lwb25zZSBKU09OIGR1IHNlcnZldXJcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZGF0YS5tZXNzYWdlIHx8IGBFcnJldXIgSFRUUDogJHtyZXNwb25zZS5zdGF0dXN9IChQYXMgZGUgbWVzc2FnZSBzcMOpY2lmaXF1ZSlgO1xuICAgICAgICBzZXRNZXNzYWdlKGBFcnJldXIgbG9ycyBkZSBsJ3VwbG9hZCA6ICR7ZXJyb3JNZXNzYWdlfWApO1xuICAgICAgfVxuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIEVycmV1ciByw6lzZWF1IG91IEpTT04gaW52YWxpZGVcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0VycmV1ciBsb3JzIGRlIGxcXCd1cGxvYWQgb3UgdHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSA6JywgZXJyb3IpO1xuICAgICAgc2V0TWVzc2FnZShgRXJyZXVyIGxvcnMgZGUgbCd1cGxvYWQgOiAke2Vycm9yLm1lc3NhZ2V9LiBWw6lyaWZpZXogbGEgY29uc29sZS5gKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gQWZmaWNoZSBsJ0lEIGRlIGwnZW5yZWdpc3RyZW1lbnQgZXQgbGUgdHlwZSBkZSByZXNzb3VyY2UgcG91ciBsZSBkw6lib2dhZ2VcbiAgY29uc3QgcmVjb3JkSWQgPSByZWNvcmQuaWQ7XG4gIGNvbnN0IGRpc3BsYXlJZCA9IHJlY29yZElkID8gYElEOiAke3JlY29yZElkfWAgOiAnSUQ6IE4vQSAodmV1aWxsZXogc2F1dmVnYXJkZXIgbFxcJ2VucmVnaXN0cmVtZW50KSc7XG4gIGNvbnN0IHJlc291cmNlSWRlbnRpZmllciA9IHJlY29yZC5yZXNvdXJjZUlkID8gYFJlc3NvdXJjZTogJHtyZWNvcmQucmVzb3VyY2VJZH1gIDogJyc7XG5cblxuICByZXR1cm4gKFxuICAgIDxCb3ggbWI9XCJ4bFwiPlxuICAgICAgPFRleHQgZm9udFdlaWdodD1cImJvbGRcIiBtYj1cInNtXCI+e3Byb3BlcnR5LmxhYmVsIHx8ICdQaG90byd9PC9UZXh0PlxuICAgICAgPFRleHQgbXQ9XCJzbVwiIG1iPVwic21cIiBmb250U3R5bGU9XCJpdGFsaWNcIj5cbiAgICAgICAge2Rpc3BsYXlJZH0ge3Jlc291cmNlSWRlbnRpZmllciAmJiBgKCR7cmVzb3VyY2VJZGVudGlmaWVyfSlgfVxuICAgICAgPC9UZXh0PlxuXG4gICAgICB7aW1hZ2VVcmwgJiYgKFxuICAgICAgICA8Qm94IG1iPVwibWRcIj5cbiAgICAgICAgICA8VGV4dCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmF5NjBcIj5JbWFnZSBhY3R1ZWxsZTo8L1RleHQ+XG4gICAgICAgICAgLy97IFMnYXNzdXJlIHF1ZSBsJ1VSTCBlc3QgY29tcGzDqHRlIHBvdXIgbCdhZmZpY2hhZ2Ugc2kgZWxsZSBlc3QgcmVsYXRpdmUgfVxuICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgIHNyYz17aW1hZ2VVcmwuc3RhcnRzV2l0aCgnLycpID8gaW1hZ2VVcmwgOiBgLyR7aW1hZ2VVcmx9YH1cbiAgICAgICAgICAgIGFsdD1cIkltYWdlIGFjdHVlbGxlXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IG1heFdpZHRoOiAnMjAwcHgnLCBoZWlnaHQ6ICdhdXRvJywgYm9yZGVyUmFkaXVzOiAnNHB4JywgbWFyZ2luVG9wOiAnOHB4JyB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFRleHQgZm9udFNpemU9XCJ4c1wiIGNvbG9yPVwiZ3JheTQwXCI+e2ltYWdlVXJsfTwvVGV4dD5cbiAgICAgICAgPC9Cb3g+XG4gICAgICApfVxuXG4gICAgICA8SW5wdXRcbiAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICBvbkNoYW5nZT17aGFuZGxlRmlsZUNoYW5nZX1cbiAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgIHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogJzEwcHgnIH19XG4gICAgICAvPlxuICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtoYW5kbGVVcGxvYWR9IGRpc2FibGVkPXshZmlsZSB8fCAhcmVjb3JkLmlkIHx8ICFyZWNvcmQucmVzb3VyY2VJZH0+XG4gICAgICAgIFVwbG9hZGVyIGxhIHBob3RvXG4gICAgICA8L0J1dHRvbj5cblxuICAgICAge21lc3NhZ2UgJiYgKFxuICAgICAgICA8VGV4dCBtdD1cIm1kXCIgY29sb3I9e21lc3NhZ2UuaW5jbHVkZXMoJ3LDqXVzc2knKSA/ICdzdWNjZXNzJyA6ICdkYW5nZXInfT5cbiAgICAgICAgICB7bWVzc2FnZX1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgKX1cblxuICAgICAgPFRleHQgbXQ9XCJtZFwiIGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyYXk2MFwiPlxuICAgICAgICBOb3RlOiBMJ3VwbG9hZCByZW1wbGFjZSBsJ2ltYWdlIGV4aXN0YW50ZS4gTGUgY2hlbWluIHNlcmEgbWlzIMOgIGpvdXIgZW4gYmFzZSBkZSBkb25uw6llcy5cbiAgICAgIDwvVGV4dD5cbiAgICA8L0JveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBob3RvVXBsb2FkQ29tcG9uZW50O1xuLy8vLy8vLy8vLy8vM2VtZWNvZGUvLy8vLy8vL1xuXG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBUZXh0LCBJbnB1dCwgTGluayB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5UHJvcHMgfSBmcm9tICdhZG1pbmpzJzsgLy8gRm9yIHByb3BzIHR5cGluZywgZXZlbiBpZiBub3Qgc3RyaWN0bHkgZW5mb3JjZWQgaW4gSlNcblxuY29uc3QgUGhvdG9VcGxvYWRDb21wb25lbnQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyByZWNvcmQsIHByb3BlcnR5LCBvbkNoYW5nZSB9ID0gcHJvcHM7XG4gIGNvbnN0IFtmaWxlLCBzZXRGaWxlXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbbWVzc2FnZSwgc2V0TWVzc2FnZV0gPSB1c2VTdGF0ZSgnJyk7XG4gIC8vIFVzZSBwcm9wZXJ0eS5uYW1lIChlLmcuLCAncGhvdG8nIG9yICdpbWFnZScpIHRvIGFjY2VzcyB0aGUgY29ycmVjdCB2YWx1ZVxuICBjb25zdCBbaW1hZ2VVcmwsIHNldEltYWdlVXJsXSA9IHVzZVN0YXRlKHJlY29yZC5wYXJhbXNbcHJvcGVydHkubmFtZV0gfHwgJycpO1xuICBjb25zdCBbaXNVcGxvYWRpbmcsIHNldElzVXBsb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTsgLy8gTmV3IHN0YXRlIHRvIHRyYWNrIHVwbG9hZCBwcm9jZXNzXG5cbiAgLy8gRWZmZWN0IHRvIHVwZGF0ZSB0aGUgaW1hZ2UgaWYgdGhlIHJlY29yZCBjaGFuZ2VzIChlLmcuLCBhZnRlciBhIHNhdmUgb3IgcmVmcmVzaClcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRJbWFnZVVybChyZWNvcmQucGFyYW1zW3Byb3BlcnR5Lm5hbWVdIHx8ICcnKTtcbiAgfSwgW3JlY29yZC5wYXJhbXNbcHJvcGVydHkubmFtZV0sIHJlY29yZC5pZF0pOyAvLyBBZGRlZCByZWNvcmQuaWQgYXMgZGVwZW5kZW5jeSBmb3IgZnJlc2ggcmVjb3JkIHVwZGF0ZVxuXG5cbiAgY29uc3QgaGFuZGxlRmlsZUNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHNlbGVjdGVkRmlsZSA9IGV2ZW50LnRhcmdldC5maWxlc1swXTtcbiAgICBzZXRGaWxlKHNlbGVjdGVkRmlsZSk7XG4gICAgc2V0TWVzc2FnZSgnJyk7IC8vIENsZWFyIHByZXZpb3VzIG1lc3NhZ2VzXG4gICAgLy8gT3B0aW9uYWw6IHNob3cgYSBwcmV2aWV3IG9mIHRoZSBuZXdseSBzZWxlY3RlZCBmaWxlIGJlZm9yZSB1cGxvYWRcbiAgICBpZiAoc2VsZWN0ZWRGaWxlKSB7XG4gICAgICAgIHNldEltYWdlVXJsKFVSTC5jcmVhdGVPYmplY3RVUkwoc2VsZWN0ZWRGaWxlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWYgZmlsZSBpbnB1dCBpcyBjbGVhcmVkLCByZXZlcnQgdG8gZXhpc3RpbmcgaW1hZ2Ugb3IgY2xlYXIgcHJldmlld1xuICAgICAgICBzZXRJbWFnZVVybChyZWNvcmQucGFyYW1zW3Byb3BlcnR5Lm5hbWVdIHx8ICcnKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlVXBsb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgIC8vIEJhc2ljIHZhbGlkYXRpb24gYmVmb3JlIHN0YXJ0aW5nIHVwbG9hZFxuICAgIGlmICghZmlsZSkge1xuICAgICAgc2V0TWVzc2FnZSgnVmV1aWxsZXogc8OpbGVjdGlvbm5lciB1biBmaWNoaWVyIGF2YW50IGRcXCd1cGxvYWRlci4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDcnVjaWFsIGNoZWNrOiB3ZSBuZWVkIGEgcmVjb3JkIElEIHRvIGxpbmsgdGhlIHBob3RvIHRvIGEgZGF0YWJhc2UgZW50cnkuXG4gICAgLy8gRm9yIG5ldyByZWNvcmRzLCB0aGUgdXNlciBtdXN0IHNhdmUgZmlyc3QuXG4gICAgaWYgKCFyZWNvcmQuaWQpIHtcbiAgICAgIHNldE1lc3NhZ2UoJ0VycmV1cjogRW5yZWdpc3RyZW1lbnQgbm9uIHNhdXZlZ2FyZMOpLiBWZXVpbGxleiBkXFwnYWJvcmQgY3LDqWVyL3NhdXZlZ2FyZGVyIGxcXCdlbnJlZ2lzdHJlbWVudCBwb3VyIG9idGVuaXIgdW4gSUQuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHJlc291cmNlSWQgc2hvdWxkIGFsd2F5cyBiZSBwcmVzZW50IGZyb20gQWRtaW5KUyBwcm9wcywgYnV0IGdvb2QgdG8gY2hlY2tcbiAgICBpZiAoIXJlY29yZC5yZXNvdXJjZUlkKSB7XG4gICAgICBzZXRNZXNzYWdlKCdFcnJldXI6IFR5cGUgZGUgcmVzc291cmNlIG1hbnF1YW50LicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNldElzVXBsb2FkaW5nKHRydWUpOyAvLyBEaXNhYmxlIHRoZSBidXR0b24gYW5kIHNob3cgbG9hZGluZyBzdGF0ZVxuICAgIHNldE1lc3NhZ2UoJ1TDqWzDqWNoYXJnZW1lbnQgZW4gY291cnMuLi4nKTsgLy8gR2l2ZSBpbW1lZGlhdGUgZmVlZGJhY2tcblxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdwaG90bycsIGZpbGUpOyAvLyAncGhvdG8nIG1hdGNoZXMgdGhlIGZpZWxkIG5hbWUgaW4gbXVsdGVyQ29uZmlnLmpzIGFuZCBVcGxvYWRBZG1pbkNvbnRyb2xsZXIuanNcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2l0ZW1JZCcsIHJlY29yZC5pZCk7IC8vIFRoZSBJRCBvZiB0aGUgcmVjb3JkIChlLmcuLCB1c2VyIElELCBtYXRlcmlhbCBJRClcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3Jlc291cmNlSWQnLCByZWNvcmQucmVzb3VyY2VJZCk7IC8vIFRoZSBBZG1pbkpTIHJlc291cmNlIG5hbWUgKGUuZy4sICd1dGlsaXNhdGV1cnMnLCAnbWF0aWVyZXMnKVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIENhbGwgdG8geW91ciBNdWx0ZXIgdXBsb2FkIGVuZHBvaW50XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYWRtaW4vdXBsb2FkLXBob3RvJywgeyAvLyBBZGp1c3QgVVJMIGlmIHlvdXIgQWRtaW5KUyBzZXR1cCB1c2VzIGEgZGlmZmVyZW50IHByZWZpeFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTsgLy8gQXR0ZW1wdCB0byBwYXJzZSB0aGUgcmVzcG9uc2UgYXMgSlNPTlxuXG4gICAgICBpZiAocmVzcG9uc2Uub2sgJiYgZGF0YS5zdWNjZXNzKSB7XG4gICAgICAgIC8vIFVwbG9hZCBzdWNjZXNzZnVsXG4gICAgICAgIHNldE1lc3NhZ2UoJ1VwbG9hZCByw6l1c3NpICEgTGEgcGFnZSBzZXJhIG1pc2Ugw6Agam91ciBhdSBwcm9jaGFpbiByYWZyYcOuY2hpc3NlbWVudCBvdSBzYXV2ZWdhcmRlLicpO1xuICAgICAgICAvLyBVcGRhdGUgdGhlIGRpc3BsYXllZCBpbWFnZSBVUkwgd2l0aCB0aGUgb25lIHJldHVybmVkIGJ5IHRoZSBzZXJ2ZXJcbiAgICAgICAgc2V0SW1hZ2VVcmwoZGF0YS5pbWFnZVVybCk7XG4gICAgICAgIHNldEZpbGUobnVsbCk7IC8vIFJlc2V0IHRoZSBmaWxlIGlucHV0IGZpZWxkXG5cbiAgICAgICAgLy8gSU1QT1JUQU5UOiBUcmlnZ2VyIGEgY2hhbmdlIGluIEFkbWluSlMgd2l0aCB0aGUgbmV3IGFjdHVhbCBVUkwuXG4gICAgICAgIC8vIFRoaXMgaXMgY3J1Y2lhbCBmb3IgdGhlIGZpZWxkJ3MgdmFsdWUgdG8gYmUgdXBkYXRlZCBpbiB0aGUgaW50ZXJmYWNlIGFuZCBzYXZlZCB0byB0aGUgZGF0YWJhc2UuXG4gICAgICAgIG9uQ2hhbmdlKHByb3BlcnR5Lm5hbWUsIGRhdGEuaW1hZ2VVcmwpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBVcGxvYWQgZmFpbGVkIGFjY29yZGluZyB0byB0aGUgc2VydmVyJ3MgSlNPTiByZXNwb25zZVxuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBkYXRhLm1lc3NhZ2UgfHwgYEVycmV1ciBIVFRQOiAke3Jlc3BvbnNlLnN0YXR1c30gKFBhcyBkZSBtZXNzYWdlIHNww6ljaWZpcXVlKWA7XG4gICAgICAgIHNldE1lc3NhZ2UoYEVycmV1ciBsb3JzIGRlIGwndXBsb2FkIDogJHtlcnJvck1lc3NhZ2V9YCk7XG4gICAgICAgIC8vIElmIHVwbG9hZCBmYWlscywga2VlcCB0aGUgc2VsZWN0ZWQgZmlsZSBmb3IgdGhlIHVzZXIgdG8gcmV0cnlcbiAgICAgIH1cblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBOZXR3b3JrIGVycm9yIG9yIGludmFsaWQgSlNPTlxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZHVyaW5nIHVwbG9hZCBvciByZXNwb25zZSBwcm9jZXNzaW5nOicsIGVycm9yKTtcbiAgICAgIHNldE1lc3NhZ2UoYEVycmV1ciBsb3JzIGRlIGwndXBsb2FkIChyw6lzZWF1L3NlcnZldXIpIDogJHtlcnJvci5tZXNzYWdlfS4gVsOpcmlmaWV6IGxhIGNvbnNvbGUuYCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldElzVXBsb2FkaW5nKGZhbHNlKTsgLy8gUmUtZW5hYmxlIHRoZSBidXR0b24gcmVnYXJkbGVzcyBvZiBzdWNjZXNzIG9yIGZhaWx1cmVcbiAgICB9XG4gIH07XG5cbiAgLy8gRGlzcGxheSByZWNvcmQgSUQgYW5kIHJlc291cmNlIHR5cGUgZm9yIGRlYnVnZ2luZ1xuICBjb25zdCByZWNvcmRJZCA9IHJlY29yZC5pZDtcbiAgY29uc3QgZGlzcGxheUlkID0gcmVjb3JkSWQgPyBgSUQ6ICR7cmVjb3JkSWR9YCA6ICdJRDogTi9BIChjcsOpZXovc2F1dmVnYXJkZXogZFxcJ2Fib3JkKSc7XG4gIGNvbnN0IHJlc291cmNlSWRlbnRpZmllciA9IHJlY29yZC5yZXNvdXJjZUlkID8gYFJlc3NvdXJjZTogJHtyZWNvcmQucmVzb3VyY2VJZH1gIDogJyc7XG5cblxuICByZXR1cm4gKFxuICAgIDxCb3ggbWI9XCJ4bFwiPlxuICAgICAgPFRleHQgZm9udFdlaWdodD1cImJvbGRcIiBtYj1cInNtXCI+e3Byb3BlcnR5LmxhYmVsIHx8ICdQaG90byd9PC9UZXh0PlxuICAgICAgPFRleHQgbXQ9XCJzbVwiIG1iPVwic21cIiBmb250U3R5bGU9XCJpdGFsaWNcIj5cbiAgICAgICAge2Rpc3BsYXlJZH0ge3Jlc291cmNlSWRlbnRpZmllciAmJiBgKCR7cmVzb3VyY2VJZGVudGlmaWVyfSlgfVxuICAgICAgPC9UZXh0PlxuXG4gICAgICB7aW1hZ2VVcmwgJiYgKFxuICAgICAgICA8Qm94IG1iPVwibWRcIj5cbiAgICAgICAgICA8VGV4dCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmF5NjBcIj5JbWFnZSBhY3R1ZWxsZTo8L1RleHQ+XG4gICAgICAgICAgLy97RW5zdXJlIHRoZSBVUkwgaXMgY29tcGxldGUgZm9yIGRpc3BsYXkgaWYgaXQncyByZWxhdGl2ZSB9XG4gICAgICAgICAgPGltZ1xuICAgICAgICAgICAgc3JjPXtpbWFnZVVybC5zdGFydHNXaXRoKCcvJykgPyBpbWFnZVVybCA6IGAvJHtpbWFnZVVybH1gfVxuICAgICAgICAgICAgYWx0PVwiSW1hZ2UgYWN0dWVsbGVcIlxuICAgICAgICAgICAgc3R5bGU9e3sgbWF4V2lkdGg6ICcyMDBweCcsIGhlaWdodDogJ2F1dG8nLCBib3JkZXJSYWRpdXM6ICc0cHgnLCBtYXJnaW5Ub3A6ICc4cHgnIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICAvL3sgTWFrZSBVUkwgY2xpY2thYmxlIGlmIGl0J3MgYSBmdWxsIHBhdGggb3IgYSByZWxhdGl2ZSBwYXRoIGZyb20gd2ViIHJvb3QgfVxuICAgICAgICAgIHtpbWFnZVVybC5zdGFydHNXaXRoKCcvJykgPyAoXG4gICAgICAgICAgICAgIDxMaW5rIGhyZWY9e2ltYWdlVXJsfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCIgZm9udFNpemU9XCJ4c1wiIGNvbG9yPVwiZ3JheTQwXCI+e2ltYWdlVXJsfTwvTGluaz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8VGV4dCBmb250U2l6ZT1cInhzXCIgY29sb3I9XCJncmF5NDBcIj57aW1hZ2VVcmx9PC9UZXh0PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cblxuICAgICAgPElucHV0XG4gICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZpbGVDaGFuZ2V9XG4gICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxuICAgICAgICBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICcxMHB4JyB9fVxuICAgICAgLz5cbiAgICAgIDxCdXR0b25cbiAgICAgICAgb25DbGljaz17aGFuZGxlVXBsb2FkfVxuICAgICAgICAvLyBCdXR0b24gaXMgZGlzYWJsZWQgaWY6XG4gICAgICAgIC8vIC0gTm8gZmlsZSBpcyBzZWxlY3RlZCBPUlxuICAgICAgICAvLyAtIE5vIHJlY29yZCBJRCBleGlzdHMgKG1lYW5pbmcgaXQncyBhIG5ldyByZWNvcmQgbm90IHlldCBzYXZlZCkgT1JcbiAgICAgICAgLy8gLSBBbiB1cGxvYWQgaXMgY3VycmVudGx5IGluIHByb2dyZXNzXG4gICAgICAgIGRpc2FibGVkPXshZmlsZSB8fCAhcmVjb3JkLmlkIHx8IGlzVXBsb2FkaW5nfVxuICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiIC8vIFN0eWxlIGZyb20gQWRtaW5KUyBEZXNpZ24gU3lzdGVtXG4gICAgICA+XG4gICAgICAgIHtpc1VwbG9hZGluZyA/ICdUw6lsw6ljaGFyZ2VtZW50Li4uJyA6ICdVcGxvYWRlciBsYSBwaG90byd9XG4gICAgICA8L0J1dHRvbj5cblxuICAgICAge21lc3NhZ2UgJiYgKFxuICAgICAgICA8VGV4dCBtdD1cIm1kXCIgY29sb3I9e21lc3NhZ2UuaW5jbHVkZXMoJ3LDqXVzc2knKSA/ICdzdWNjZXNzJyA6ICdkYW5nZXInfT5cbiAgICAgICAgICB7bWVzc2FnZX1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgKX1cblxuICAgICAgPFRleHQgbXQ9XCJtZFwiIGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyYXk2MFwiPlxuICAgICAgICBOb3RlOiBMJ3VwbG9hZCByZW1wbGFjZSBsJ2ltYWdlIGV4aXN0YW50ZS4gTGUgY2hlbWluIHNlcmEgbWlzIMOgIGpvdXIgZW4gYmFzZSBkZSBkb25uw6llcyBhcHLDqHMgc2F1dmVnYXJkZS5cbiAgICAgIDwvVGV4dD5cbiAgICA8L0JveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBob3RvVXBsb2FkQ29tcG9uZW50OyovXG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIFRleHQsIElucHV0LCBMaW5rIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBCYXNlUHJvcGVydHlQcm9wcyB9IGZyb20gJ2FkbWluanMnO1xuXG5jb25zdCBQaG90b1VwbG9hZENvbXBvbmVudCA9IChwcm9wcykgPT4ge1xuICBjb25zb2xlLmxvZyhcIlBob3RvVXBsb2FkQ29tcG9uZW50IHJlY2VpdmVkIHByb3BzOlwiLCBwcm9wcyk7XG4gIC8vIE1PRElGSUNBVElPTiBJQ0kgOiBJbmNsdWV6ICdyZXNvdXJjZScgZGFucyBsYSBkZXN0cnVjdHVyYXRpb24gZGVzIHByb3BzXG4gIGNvbnN0IHsgcmVjb3JkLCBwcm9wZXJ0eSwgb25DaGFuZ2UsIHJlc291cmNlIH0gPSBwcm9wcztcbiAgY29uc3QgW2ZpbGUsIHNldEZpbGVdID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFttZXNzYWdlLCBzZXRNZXNzYWdlXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2ltYWdlVXJsLCBzZXRJbWFnZVVybF0gPSB1c2VTdGF0ZShyZWNvcmQucGFyYW1zW3Byb3BlcnR5Lm5hbWVdIHx8ICcnKTtcbiAgY29uc3QgW2lzVXBsb2FkaW5nLCBzZXRJc1VwbG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IGJ1dHRvblJlZiA9IHVzZVJlZihudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiUGhvdG9VcGxvYWRDb21wb25lbnQ6IHVzZUVmZmVjdCB0cmlnZ2VyZWQuIEN1cnJlbnQgaW1hZ2UgVVJMOlwiLCByZWNvcmQucGFyYW1zW3Byb3BlcnR5Lm5hbWVdKTtcbiAgICBzZXRJbWFnZVVybChyZWNvcmQucGFyYW1zW3Byb3BlcnR5Lm5hbWVdIHx8ICcnKTtcblxuICAgIC8vIEFKT1VUIEQnVU4gTElTVEVORVIgRCfDiVbDiU5FTUVOVCBESVJFQ1QgU1VSIExFIERPTSBQT1VSIETDiUJPR0FHRVxuICAgIGlmIChidXR0b25SZWYuY3VycmVudCkge1xuICAgICAgY29uc3QgY3VycmVudEJ1dHRvbiA9IGJ1dHRvblJlZi5jdXJyZW50O1xuICAgICAgY29uc3QgaGFuZGxlQ2xpY2tEZWJ1ZyA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRFQlVHOiBDbGljIGRpcmVjdCBzdXIgbGUgYm91dG9uIERPTSBkw6l0ZWN0w6khXCIsIGV2ZW50KTtcbiAgICAgIH07XG4gICAgICBjdXJyZW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlQ2xpY2tEZWJ1Zyk7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjdXJyZW50QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlQ2xpY2tEZWJ1Zyk7XG4gICAgICB9O1xuICAgIH1cbiAgfSwgW3JlY29yZC5wYXJhbXNbcHJvcGVydHkubmFtZV0sIHJlY29yZC5pZF0pO1xuXG5cbiAgY29uc3QgaGFuZGxlRmlsZUNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IHNlbGVjdGVkRmlsZSA9IGV2ZW50LnRhcmdldC5maWxlc1swXTtcbiAgICBjb25zb2xlLmxvZyhcImhhbmRsZUZpbGVDaGFuZ2U6IEZpY2hpZXIgc8OpbGVjdGlvbm7DqTpcIiwgc2VsZWN0ZWRGaWxlKTtcbiAgICBzZXRGaWxlKHNlbGVjdGVkRmlsZSk7XG4gICAgc2V0TWVzc2FnZSgnJyk7XG4gICAgaWYgKHNlbGVjdGVkRmlsZSkge1xuICAgICAgY29uc3QgcHJldmlld1VybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoc2VsZWN0ZWRGaWxlKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiaGFuZGxlRmlsZUNoYW5nZTogR8OpbsOpcmF0aW9uIGRlIGxhIHByw6l2aXN1YWxpc2F0aW9uIFVSTDpcIiwgcHJldmlld1VybCk7XG4gICAgICBzZXRJbWFnZVVybChwcmV2aWV3VXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVGaWxlQ2hhbmdlOiBBdWN1biBmaWNoaWVyIHPDqWxlY3Rpb25uw6ksIHLDqWluaXRpYWxpc2F0aW9uIGRlIGxhIHByw6l2aXN1YWxpc2F0aW9uLlwiKTtcbiAgICAgIHNldEltYWdlVXJsKHJlY29yZC5wYXJhbXNbcHJvcGVydHkubmFtZV0gfHwgJycpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVVcGxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJoYW5kbGVVcGxvYWQ6IETDqWJ1dCBkZSBsJ2V4w6ljdXRpb24uXCIpO1xuICAgIC8vIE1PRElGSUNBVElPTiBJQ0kgOiBVdGlsaXNleiByZXNvdXJjZS5pZCBhdSBsaWV1IGRlIHJlY29yZC5yZXNvdXJjZUlkXG4gICAgY29uc29sZS5sb2coXCJoYW5kbGVVcGxvYWQ6IHJlY29yZC5pZCA9XCIsIHJlY29yZC5pZCwgXCJyZXNvdXJjZS5pZCA9XCIsIHJlc291cmNlLmlkKTtcblxuICAgIGlmICghZmlsZSkge1xuICAgICAgc2V0TWVzc2FnZSgnVmV1aWxsZXogc8OpbGVjdGlvbm5lciB1biBmaWNoaWVyIGF2YW50IGRcXCd1cGxvYWRlci4nKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiaGFuZGxlVXBsb2FkOiBWYWxpZGF0aW9uIMOpY2hvdcOpZSAtIEF1Y3VuIGZpY2hpZXIgc8OpbGVjdGlvbm7DqS5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFyZWNvcmQuaWQpIHtcbiAgICAgIHNldE1lc3NhZ2UoJ0VycmV1cjogRW5yZWdpc3RyZW1lbnQgbm9uIHNhdXZlZ2FyZMOpLiBWZXVpbGxleiBkXFwnYWJvcmQgY3LDqWVyL3NhdXZlZ2FyZGVyIGxcXCdlbnJlZ2lzdHJlbWVudCBwb3VyIG9idGVuaXIgdW4gSUQuJyk7XG4gICAgICBjb25zb2xlLmxvZyhcImhhbmRsZVVwbG9hZDogVmFsaWRhdGlvbiDDqWNob3XDqWUgLSBJRCBkZSBsJ2VucmVnaXN0cmVtZW50IG1hbnF1YW50IChyZWNvcmQuaWQgZXN0IG51bGwvdW5kZWZpbmVkKS5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIE1PRElGSUNBVElPTiBJQ0kgOiBVdGlsaXNleiByZXNvdXJjZS5pZCBwb3VyIGxhIHZhbGlkYXRpb25cbiAgICBpZiAoIXJlc291cmNlLmlkKSB7XG4gICAgICBzZXRNZXNzYWdlKCdFcnJldXI6IFR5cGUgZGUgcmVzc291cmNlIG1hbnF1YW50LicpO1xuICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVVcGxvYWQ6IFZhbGlkYXRpb24gw6ljaG91w6llIC0gVHlwZSBkZSByZXNzb3VyY2UgKHJlc291cmNlLmlkKSBtYW5xdWFudC5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2V0SXNVcGxvYWRpbmcodHJ1ZSk7XG4gICAgc2V0TWVzc2FnZSgnVMOpbMOpY2hhcmdlbWVudCBlbiBjb3Vycy4uLicpO1xuICAgIGNvbnNvbGUubG9nKFwiaGFuZGxlVXBsb2FkOiBpc1VwbG9hZGluZyBkw6lmaW5pIMOgIHRydWUsIG1lc3NhZ2UgYWZmaWNow6kuXCIpO1xuXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ3Bob3RvJywgZmlsZSk7XG4gICAgZm9ybURhdGEuYXBwZW5kKCdpdGVtSWQnLCByZWNvcmQuaWQpO1xuICAgIC8vIE1PRElGSUNBVElPTiBJQ0kgOiBVdGlsaXNleiByZXNvdXJjZS5pZCBwb3VyIEZvcm1EYXRhXG4gICAgZm9ybURhdGEuYXBwZW5kKCdyZXNvdXJjZUlkJywgcmVzb3VyY2UuaWQpO1xuICAgIGNvbnNvbGUubG9nKFwiaGFuZGxlVXBsb2FkOiBGb3JtRGF0YSBwcsOpcGFyw6kgYXZlYyBwaG90bywgaXRlbUlkOlwiLCByZWNvcmQuaWQsIFwiZXQgcmVzb3VyY2VJZDpcIiwgcmVzb3VyY2UuaWQpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiaGFuZGxlVXBsb2FkOiBFbnZvaSBkZSBsYSByZXF1w6p0ZSBmZXRjaCBQT1NUIMOgIC9hZG1pbi91cGxvYWQtcGhvdG8uLi5cIik7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYWRtaW4vdXBsb2FkLXBob3RvJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICB9KTtcblxuICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVVcGxvYWQ6IFJlcXXDqnRlIGZldGNoIHRlcm1pbsOpZS4gU3RhdHV0IGRlIGxhIHLDqXBvbnNlIEhUVFA6XCIsIHJlc3BvbnNlLnN0YXR1cywgXCJVUkwgZGUgbGEgcsOpcG9uc2U6XCIsIHJlc3BvbnNlLnVybCk7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVVcGxvYWQ6IFLDqXBvbnNlIEpTT04gZHUgc2VydmV1cjpcIiwgZGF0YSk7XG5cbiAgICAgIGlmIChyZXNwb25zZS5vayAmJiBkYXRhLnN1Y2Nlc3MpIHtcbiAgICAgICAgc2V0TWVzc2FnZSgnVXBsb2FkIHLDqXVzc2kgISBMYSBwYWdlIHNlcmEgbWlzZSDDoCBqb3VyIGF1IHByb2NoYWluIHJhZnJhw65jaGlzc2VtZW50IG91IHNhdXZlZ2FyZGUuJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaGFuZGxlVXBsb2FkOiBTdWNjw6hzIGRlIGwndXBsb2FkLiBOb3V2ZWxsZSBVUkwgZGUgbCdpbWFnZTpcIiwgZGF0YS5pbWFnZVVybCk7XG4gICAgICAgIHNldEltYWdlVXJsKGRhdGEuaW1hZ2VVcmwpO1xuICAgICAgICBzZXRGaWxlKG51bGwpO1xuICAgICAgICBvbkNoYW5nZShwcm9wZXJ0eS5uYW1lLCBkYXRhLmltYWdlVXJsKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVVcGxvYWQ6IG9uQ2hhbmdlIGFwcGVsw6kgcG91ciBtZXR0cmUgw6Agam91ciBsYSBwcm9wcmnDqXTDqSBBZG1pbkpTIGF2ZWM6XCIsIGRhdGEuaW1hZ2VVcmwpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBkYXRhLm1lc3NhZ2UgfHwgYEVycmV1ciBIVFRQOiAke3Jlc3BvbnNlLnN0YXR1c30gKFBhcyBkZSBtZXNzYWdlIHNww6ljaWZpcXVlKWA7XG4gICAgICAgIHNldE1lc3NhZ2UoYEVycmV1ciBsb3JzIGRlIGwndXBsb2FkIDogJHtlcnJvck1lc3NhZ2V9YCk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJoYW5kbGVVcGxvYWQ6IMOJY2hlYyBkZSBsJ3VwbG9hZC4gTWVzc2FnZSBkJ2VycmV1cjpcIiwgZXJyb3JNZXNzYWdlKTtcbiAgICAgIH1cblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdoYW5kbGVVcGxvYWQ6IEVycmV1ciBjcml0aXF1ZSAocsOpc2VhdSBvdSBKU09OIGludmFsaWRlKSBsb3JzIGRlIGxcXCd1cGxvYWQgb3UgZHUgdHJhaXRlbWVudCBkZSBsYSByw6lwb25zZSA6JywgZXJyb3IpO1xuICAgICAgc2V0TWVzc2FnZShgRXJyZXVyIGxvcnMgZGUgbCd1cGxvYWQgKHLDqXNlYXUvc2VydmV1cikgOiAke2Vycm9yLm1lc3NhZ2V9LiBWw6lyaWZpZXogbGEgY29uc29sZS5gKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0SXNVcGxvYWRpbmcoZmFsc2UpO1xuICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVVcGxvYWQ6IEZpbiBkZSBsJ2V4w6ljdXRpb24gKGZpbmFsbHkpLCBpc1VwbG9hZGluZyBkw6lmaW5pIMOgIGZhbHNlLlwiKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVjb3JkSWQgPSByZWNvcmQuaWQ7XG4gIGNvbnN0IGRpc3BsYXlJZCA9IHJlY29yZElkID8gYElEOiAke3JlY29yZElkfWAgOiAnSUQ6IE4vQSAoY3LDqWV6L3NhdXZlZ2FyZGV6IGRcXCdhYm9yZCknO1xuICAvLyBNT0RJRklDQVRJT04gSUNJIDogVXRpbGlzZXogcmVzb3VyY2UuaWQgcG91ciBsJ2FmZmljaGFnZSBkZSBkw6lib2dhZ2VcbiAgY29uc3QgcmVzb3VyY2VJZGVudGlmaWVyID0gcmVzb3VyY2UuaWQgPyBgUmVzc291cmNlOiAke3Jlc291cmNlLmlkfWAgOiAnJztcbiAgLy8gTU9ESUZJQ0FUSU9OIElDSSA6IFV0aWxpc2V6IHJlc291cmNlLmlkIHBvdXIgbGUgbG9nIGRlIHJlbmR1XG4gIGNvbnNvbGUubG9nKFwiUGhvdG9VcGxvYWRDb21wb25lbnQ6IFJlbmRlci4gQ3VycmVudCByZWNvcmQgSUQ6XCIsIHJlY29yZElkLCBcIlJlc291cmNlIElEOlwiLCByZXNvdXJjZS5pZCk7XG5cblxuICByZXR1cm4gKFxuICAgIDxCb3ggbWI9XCJ4bFwiPlxuICAgICAgPFRleHQgZm9udFdlaWdodD1cImJvbGRcIiBtYj1cInNtXCI+e3Byb3BlcnR5LmxhYmVsIHx8ICdQaG90byd9PC9UZXh0PlxuICAgICAgPFRleHQgbXQ9XCJzbVwiIG1iPVwic21cIiBmb250U3R5bGU9XCJpdGFsaWNcIj5cbiAgICAgICAge2Rpc3BsYXlJZH0ge3Jlc291cmNlSWRlbnRpZmllciAmJiBgKCR7cmVzb3VyY2VJZGVudGlmaWVyfSlgfVxuICAgICAgPC9UZXh0PlxuXG4gICAgICB7aW1hZ2VVcmwgJiYgKFxuICAgICAgICA8Qm94IG1iPVwibWRcIj5cbiAgICAgICAgICA8VGV4dCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmF5NjBcIj5JbWFnZSBhY3R1ZWxsZTo8L1RleHQ+XG4gICAgICAgICAgPGltZ1xuICAgICAgICAgICAgc3JjPXtpbWFnZVVybC5zdGFydHNXaXRoKCcvJykgPyBpbWFnZVVybCA6IGAvJHtpbWFnZVVybH1gfVxuICAgICAgICAgICAgYWx0PVwiSW1hZ2UgYWN0dWVsbGVcIlxuICAgICAgICAgICAgc3R5bGU9e3sgbWF4V2lkdGg6ICcyMDBweCcsIGhlaWdodDogJ2F1dG8nLCBib3JkZXJSYWRpdXM6ICc0cHgnLCBtYXJnaW5Ub3A6ICc4cHgnIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7aW1hZ2VVcmwuc3RhcnRzV2l0aCgnLycpID8gKFxuICAgICAgICAgICAgPExpbmsgaHJlZj17aW1hZ2VVcmx9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIiBmb250U2l6ZT1cInhzXCIgY29sb3I9XCJncmF5NDBcIj57aW1hZ2VVcmx9PC9MaW5rPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VGV4dCBmb250U2l6ZT1cInhzXCIgY29sb3I9XCJncmF5NDBcIj57aW1hZ2VVcmx9PC9UZXh0PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvQm94PlxuICAgICAgKX1cblxuICAgICAgPElucHV0XG4gICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZpbGVDaGFuZ2V9XG4gICAgICAgIGFjY2VwdD1cImltYWdlLypcIlxuICAgICAgICBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICcxMHB4JyB9fVxuICAgICAgLz5cbiAgICAgIDxCdXR0b25cbiAgICAgICAgcmVmPXtidXR0b25SZWZ9XG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBvbkNsaWNrPXtoYW5kbGVVcGxvYWR9XG4gICAgICAgIGRpc2FibGVkPXshZmlsZSB8fCAhcmVjb3JkLmlkIHx8IGlzVXBsb2FkaW5nfVxuICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiXG4gICAgICA+XG4gICAgICAgIHtpc1VwbG9hZGluZyA/ICdUw6lsw6ljaGFyZ2VtZW50Li4uJyA6ICdVcGxvYWRlciBsYSBwaG90byd9XG4gICAgICA8L0J1dHRvbj5cblxuICAgICAge21lc3NhZ2UgJiYgKFxuICAgICAgICA8VGV4dCBtdD1cIm1kXCIgY29sb3I9e21lc3NhZ2UuaW5jbHVkZXMoJ3LDqXVzc2knKSA/ICdzdWNjZXNzJyA6ICdkYW5nZXInfT5cbiAgICAgICAgICB7bWVzc2FnZX1cbiAgICAgICAgPC9UZXh0PlxuICAgICAgKX1cblxuICAgICAgPFRleHQgbXQ9XCJtZFwiIGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyYXk2MFwiPlxuICAgICAgICBOb3RlOiBMJ3VwbG9hZCByZW1wbGFjZSBsJ2ltYWdlIGV4aXN0YW50ZS4gTGUgY2hlbWluIHNlcmEgbWlzIMOgIGpvdXIgZW4gYmFzZSBkZSBkb25uw6llcyBhcHLDqHMgc2F1dmVnYXJkZS5cbiAgICAgIDwvVGV4dD5cbiAgICA8L0JveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBob3RvVXBsb2FkQ29tcG9uZW50OyIsIi8qaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5UHJvcHMgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgTGFiZWwsIEJveCwgRHJvcFpvbmUgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuXG5jb25zdCBQREZVcGxvYWRDb21wb25lbnQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBvbkNoYW5nZSwgcHJvcGVydHksIHJlY29yZCB9ID0gcHJvcHNcblxuICBjb25zdCB1cGxvYWRlZEZpbGUgPSByZWNvcmQucGFyYW1zPy5bcHJvcGVydHkubmFtZV1cblxuICBjb25zdCBoYW5kbGVVcGxvYWQgPSBhc3luYyAoZmlsZXMpID0+IHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgZm9ybURhdGEuYXBwZW5kKCdwZGYnLCBmaWxlc1swXSkgIC8vIDwtLSBjbMOpIGNvcnJpZ8OpZSBpY2kgOiAncGRmJ1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL3VwbG9hZC9wZGYnLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgIH0pXG5cbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgaWYgKGRhdGEuZmlsZW5hbWUpIHtcbiAgICAgIG9uQ2hhbmdlKHByb3BlcnR5Lm5hbWUsIGRhdGEuZmlsZW5hbWUpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94PlxuICAgICAgPExhYmVsPntwcm9wZXJ0eS5sYWJlbH08L0xhYmVsPlxuICAgICAgPERyb3Bab25lXG4gICAgICAgIG9uQ2hhbmdlPXsoZmlsZXMpID0+IGhhbmRsZVVwbG9hZChmaWxlcyl9XG4gICAgICAgIGFjY2VwdD1cIi5wZGZcIlxuICAgICAgLz5cbiAgICAgIHt1cGxvYWRlZEZpbGUgJiYgKFxuICAgICAgICA8cCBzdHlsZT17eyBtYXJnaW5Ub3A6ICcxMHB4JyB9fT5cbiAgICAgICAgICBGaWNoaWVyIGFjdHVlbCA6IDxzdHJvbmc+e3VwbG9hZGVkRmlsZX08L3N0cm9uZz5cbiAgICAgICAgPC9wPlxuICAgICAgKX1cbiAgICA8L0JveD5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQREZVcGxvYWRDb21wb25lbnQqL1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQmFzZVByb3BlcnR5UHJvcHMgfSBmcm9tICdhZG1pbmpzJ1xuaW1wb3J0IHsgTGFiZWwsIEJveCwgRHJvcFpvbmUgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJ1xuXG5jb25zdCBQREZVcGxvYWRDb21wb25lbnQgPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBvbkNoYW5nZSwgcHJvcGVydHksIHJlY29yZCB9ID0gcHJvcHNcbiAgY29uc3QgdXBsb2FkZWRGaWxlID0gcmVjb3JkLnBhcmFtcz8uW3Byb3BlcnR5Lm5hbWVdXG5cbiAgY29uc3QgaGFuZGxlVXBsb2FkID0gYXN5bmMgKGZpbGVzKSA9PiB7XG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxuICAgIGZvcm1EYXRhLmFwcGVuZCgncGRmJywgZmlsZXNbMF0pIC8vIOKchSB0csOocyBpbXBvcnRhbnRcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCdodHRwOi8vbG9jYWxob3N0OjMwMzMvYWRtaW4vdXBsb2FkL3BkZicsIHsgIC8vIDwtLSBVUkwgY29tcGzDqHRlIGV0IGNvcnJlY3RlXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgIH0pXG5cbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQIGVycm9yISBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcbiAgICAgIGlmIChkYXRhLmZpbGVuYW1lKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQREYgdXBsb2FkIHN1Y2Nlc3M6JywgZGF0YS5maWxlbmFtZSlcbiAgICAgICAgb25DaGFuZ2UocHJvcGVydHkubmFtZSwgZGF0YS5maWxlbmFtZSkgLy8g4pyFIHRyw6hzIGltcG9ydGFudCA6IG9uIG1ldCDDoCBqb3VyIGxlIGNoYW1wIGF2ZWMgbGUgbm9tIGR1IGZpY2hpZXJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1BERiB1cGxvYWQgZmFpbGVkOicsIGRhdGEpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1VwbG9hZCBlcnJvcjonLCBlcnJvcilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxCb3g+XG4gICAgICA8TGFiZWw+e3Byb3BlcnR5LmxhYmVsfTwvTGFiZWw+XG4gICAgICA8RHJvcFpvbmVcbiAgICAgICAgb25DaGFuZ2U9eyhmaWxlcykgPT4gaGFuZGxlVXBsb2FkKGZpbGVzKX1cbiAgICAgICAgYWNjZXB0PVwiLnBkZlwiXG4gICAgICAvPlxuICAgICAge3VwbG9hZGVkRmlsZSAmJiAoXG4gICAgICAgIDxwIHN0eWxlPXt7IG1hcmdpblRvcDogJzEwcHgnIH19PlxuICAgICAgICAgIEZpY2hpZXIgYWN0dWVsIDogPHN0cm9uZz57dXBsb2FkZWRGaWxlfTwvc3Ryb25nPlxuICAgICAgICA8L3A+XG4gICAgICApfVxuICAgIDwvQm94PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBERlVwbG9hZENvbXBvbmVudFxuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgTXlQaG90b1VwbG9hZENvbXBvbmVudCBmcm9tICcuLi9BZG1pbi9jb21wb25lbnRzL1Bob3RvVXBsb2FkQ29tcG9uZW50J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5NeVBob3RvVXBsb2FkQ29tcG9uZW50ID0gTXlQaG90b1VwbG9hZENvbXBvbmVudFxuaW1wb3J0IFBERlVwbG9hZENvbXBvbmVudCBmcm9tICcuLi9BZG1pbi9jb21wb25lbnRzL1BERlVwbG9hZENvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUERGVXBsb2FkQ29tcG9uZW50ID0gUERGVXBsb2FkQ29tcG9uZW50Il0sIm5hbWVzIjpbIlBob3RvVXBsb2FkQ29tcG9uZW50IiwicHJvcHMiLCJjb25zb2xlIiwibG9nIiwicmVjb3JkIiwicHJvcGVydHkiLCJvbkNoYW5nZSIsInJlc291cmNlIiwiZmlsZSIsInNldEZpbGUiLCJ1c2VTdGF0ZSIsIm1lc3NhZ2UiLCJzZXRNZXNzYWdlIiwiaW1hZ2VVcmwiLCJzZXRJbWFnZVVybCIsInBhcmFtcyIsIm5hbWUiLCJpc1VwbG9hZGluZyIsInNldElzVXBsb2FkaW5nIiwiYnV0dG9uUmVmIiwidXNlUmVmIiwidXNlRWZmZWN0IiwiY3VycmVudCIsImN1cnJlbnRCdXR0b24iLCJoYW5kbGVDbGlja0RlYnVnIiwiZXZlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImlkIiwiaGFuZGxlRmlsZUNoYW5nZSIsInNlbGVjdGVkRmlsZSIsInRhcmdldCIsImZpbGVzIiwicHJldmlld1VybCIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImhhbmRsZVVwbG9hZCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJyZXNwb25zZSIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsInN0YXR1cyIsInVybCIsImRhdGEiLCJqc29uIiwib2siLCJzdWNjZXNzIiwiZXJyb3JNZXNzYWdlIiwiZXJyb3IiLCJyZWNvcmRJZCIsImRpc3BsYXlJZCIsInJlc291cmNlSWRlbnRpZmllciIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkJveCIsIm1iIiwiVGV4dCIsImZvbnRXZWlnaHQiLCJsYWJlbCIsIm10IiwiZm9udFN0eWxlIiwiZm9udFNpemUiLCJjb2xvciIsInNyYyIsInN0YXJ0c1dpdGgiLCJhbHQiLCJzdHlsZSIsIm1heFdpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyUmFkaXVzIiwibWFyZ2luVG9wIiwiTGluayIsImhyZWYiLCJyZWwiLCJJbnB1dCIsInR5cGUiLCJhY2NlcHQiLCJtYXJnaW5Cb3R0b20iLCJCdXR0b24iLCJyZWYiLCJvbkNsaWNrIiwiZGlzYWJsZWQiLCJ2YXJpYW50IiwiaW5jbHVkZXMiLCJQREZVcGxvYWRDb21wb25lbnQiLCJ1cGxvYWRlZEZpbGUiLCJFcnJvciIsImZpbGVuYW1lIiwiTGFiZWwiLCJEcm9wWm9uZSIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyIsIk15UGhvdG9VcGxvYWRDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFBQTtFQUNBO0VBQ0E7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFFQTtFQUNBO0VBQ0E7RUFDQTs7O0VBR0E7RUFDQTtFQUNBO0VBQ0E7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFFQTtFQUNBO0VBQ0E7RUFDQTs7RUFFQTtFQUNBO0VBQ0E7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBRUE7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTtFQUNBOzs7RUFHQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTs7RUFFQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztFQUVBOztFQXdTQSxNQUFNQSxvQkFBb0IsR0FBSUMsS0FBSyxJQUFLO0VBQ3RDQyxFQUFBQSxPQUFPLENBQUNDLEdBQUcsQ0FBQyxzQ0FBc0MsRUFBRUYsS0FBSyxDQUFDO0VBQzFEO0lBQ0EsTUFBTTtNQUFFRyxNQUFNO01BQUVDLFFBQVE7TUFBRUMsUUFBUTtFQUFFQyxJQUFBQTtFQUFTLEdBQUMsR0FBR04sS0FBSztJQUN0RCxNQUFNLENBQUNPLElBQUksRUFBRUMsT0FBTyxDQUFD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
