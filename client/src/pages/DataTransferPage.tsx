import { useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { FileUpload } from 'primereact/fileupload';
import type {
  FileUploadHandlerEvent,
  FileUpload as FileUploadType,
} from 'primereact/fileupload';
import { Message } from 'primereact/message';

import {
  exportData,
  importData,
} from '../services/dataTransferService';
import { useToast } from '../hooks/useToast';

function DataTransferPage() {
  const { showError, showSuccess } = useToast();

  const fileUploadRef = useRef<FileUploadType>(null);

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  async function handleExport() {
    try {
      setExporting(true);

      const blob = await exportData();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      const date = new Date().toISOString().slice(0, 10);

      link.href = url;
      link.download = `supmeal-export-${date}.json`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      showSuccess(
        'Export terminé',
        'Vos recettes et cookbooks ont été exportés.',
      );
    } catch {
      showError(
        'Export impossible',
        'Le fichier n’a pas pu être généré.',
      );
    } finally {
      setExporting(false);
    }
  }

  async function handleImport(
    event: FileUploadHandlerEvent,
  ) {
    const file = event.files[0];

    if (!file) {
      showError(
        'Fichier manquant',
        'Sélectionnez un fichier JSON.',
      );
      return;
    }

    try {
      setImporting(true);

      const result = await importData(file);

      showSuccess(
        'Import terminé',
        `${result.importedRecipes} recette(s) et ${result.importedCookbooks} cookbook(s) importé(s).`,
      );

      fileUploadRef.current?.clear();
    } catch {
      showError(
        'Import impossible',
        'Le fichier est invalide ou incompatible.',
      );
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="flex flex-column gap-4">
      <div>
        <h1 className="mb-2">Import et export</h1>

        <p className="mt-0 text-600">
          Sauvegardez ou restaurez vos recettes et cookbooks.
        </p>
      </div>

      <Card title="Exporter mes données">
        <p>
          Téléchargez un fichier JSON contenant vos recettes,
          leurs ingrédients, leurs tags et vos cookbooks.
        </p>

        <Message
          severity="warn"
          text="Le fichier exporté contient des données lisibles en clair. Conservez-le dans un emplacement sécurisé."
          className="w-full mb-3"
        />

        <Button
          label="Exporter mes données"
          icon="pi pi-download"
          loading={exporting}
          onClick={() => {
            void handleExport();
          }}
        />
      </Card>

      <Divider />

      <Card title="Importer des données">
        <p>
          Importez un fichier JSON précédemment exporté depuis SUPMEAL.
          Les recettes et cookbooks importés seront ajoutés à votre compte.
        </p>

        <Message
          severity="info"
          text="L’import ne supprime pas vos données existantes. De nouveaux identifiants seront créés."
          className="w-full mb-3"
        />

        <FileUpload
          ref={fileUploadRef}
          name="file"
          mode="advanced"
          accept="application/json,.json"
          maxFileSize={10 * 1024 * 1024}
          customUpload
          uploadHandler={(event) => {
            void handleImport(event);
          }}
          chooseLabel="Choisir un fichier"
          uploadLabel="Importer"
          cancelLabel="Annuler"
          emptyTemplate={
            <p className="m-0">
              Glissez-déposez un fichier JSON ici.
            </p>
          }
          disabled={importing}
        />
      </Card>
    </div>
  );
}

export default DataTransferPage;