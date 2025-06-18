
import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Text, Input, Link } from '@adminjs/design-system';


const PhotoUploadComponent = (props) => {
  console.log("PhotoUploadComponent received props:", props);
  // MODIFICATION ICI : Incluez 'resource' dans la destructuration des props
  const { record, property, onChange, resource } = props;
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState(record.params[property.name] || '');
  const [isUploading, setIsUploading] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    console.log("PhotoUploadComponent: useEffect triggered. Current image URL:", record.params[property.name]);
    setImageUrl(record.params[property.name] || '');

    // AJOUT D'UN LISTENER D'ÉVÉNEMENT DIRECT SUR LE DOM POUR DÉBOGAGE
    if (buttonRef.current) {
      const currentButton = buttonRef.current;
      const handleClickDebug = (event) => {
        console.log("DEBUG: Clic direct sur le bouton DOM détecté!", event);
      };
      currentButton.addEventListener('click', handleClickDebug);
      return () => {
        currentButton.removeEventListener('click', handleClickDebug);
      };
    }
  }, [record.params[property.name], record.id]);


  const handleFileChange = (event) => {
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
        body: formData,
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


  return (
    <Box mb="xl">
      <Text fontWeight="bold" mb="sm">{property.label || 'Photo'}</Text>
      <Text mt="sm" mb="sm" fontStyle="italic">
        {displayId} {resourceIdentifier && `(${resourceIdentifier})`}
      </Text>

      {imageUrl && (
        <Box mb="md">
          <Text fontSize="sm" color="gray60">Image actuelle:</Text>
          <img
            src={imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}
            alt="Image actuelle"
            style={{ maxWidth: '200px', height: 'auto', borderRadius: '4px', marginTop: '8px' }}
          />
          {imageUrl.startsWith('/') ? (
            <Link href={imageUrl} target="_blank" rel="noopener noreferrer" fontSize="xs" color="gray40">{imageUrl}</Link>
          ) : (
            <Text fontSize="xs" color="gray40">{imageUrl}</Text>
          )}
        </Box>
      )}

      <Input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        style={{ marginBottom: '10px' }}
      />
      <Button
        ref={buttonRef}
        type="button"
        onClick={handleUpload}
        disabled={!file || !record.id || isUploading}
        variant="primary"
      >
        {isUploading ? 'Téléchargement...' : 'Uploader la photo'}
      </Button>

      {message && (
        <Text mt="md" color={message.includes('réussi') ? 'success' : 'danger'}>
          {message}
        </Text>
      )}

      <Text mt="md" fontSize="sm" color="gray60">
        Note: L'upload remplace l'image existante. Le chemin sera mis à jour en base de données après sauvegarde.
      </Text>
    </Box>
  );
};

export default PhotoUploadComponent;