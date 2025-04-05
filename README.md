# Frontend - Todo List Application (React)

## Configuration et démarrage du frontend

Dans un nouveau terminal :

```bash
cd frontend
yarn install
yarn dev
```

### Objectifs du projet

L'objectif principal est d'implémenter des fonctionnalités de gestion des tâches : création, édition et suppression. 

### Structure du code

Le composant principal pour la gestion des tâches est `TodoPage`. Il se charge de l'affichage des tâches et des interactions utilisateur (ajouter, modifier, supprimer). Le code utilise principalement **React hooks** pour gérer l'état de l'application, avec un système de récupération et manipulation des données via des appels API à l'arrière-plan.

### Fonctionnalités implémentées

- **Affichage des tâches** : Les tâches sont récupérées depuis l'API via la fonction `handleFetchTasks` et affichées dans une liste interactive.
- **Création de tâche** : Un champ de saisie permet d'ajouter de nouvelles tâches. Si une tâche est en mode édition, elle est mise à jour avec le nouveau nom.
- **Édition de tâche** : En cliquant sur le bouton d'édition, une tâche peut être modifiée.
- **Suppression de tâche** : La fonction `handleDelete` permet de supprimer une tâche. Après chaque suppression, la liste des tâches est rafraîchie.

### Explication des principales fonctions

1. **handleFetchTasks** :  
   Cette fonction est utilisée pour récupérer toutes les tâches depuis le backend. Elle est appelée après chaque modification (ajout, suppression, édition) pour assurer que l'interface utilisateur est à jour.

   ```typescript
   const handleFetchTasks = async () => setTasks(await api.get('/tasks'));
   ```

2. **handleDelete** :  
   Cette fonction permet de supprimer une tâche en faisant appel à l'API. Après la suppression, elle rafraîchit la liste des tâches pour refléter la modification.

   ```typescript
   const handleDelete = async (id: number) => {
     try {
       await api.delete(`/tasks/${id}`);
       handleFetchTasks(); // Rafraîchit la liste des tâches après suppression
     } catch (error) {
       console.error('Échec de la suppression de la tâche :', error);
     }
   };
   ```

3. **handleSave** :  
   La fonction `handleSave` gère l'ajout ou la mise à jour des tâches. Si nous sommes en mode édition, elle met à jour la tâche existante ; sinon, elle ajoute une nouvelle tâche.

   ```typescript
   const handleSave = async () => {
     if (editingTask) {
       // Si nous sommes en train de modifier une tâche existante
       if (editingTask.name !== newTaskName) {
         try {
           await api.patch(`/tasks/${editingTask.id}`, { 
             id: editingTask.id, 
             name: newTaskName 
           }); 
           handleFetchTasks(); 
           setEditingTask(null); 
         } catch (error) {
           console.error('Échec de la mise à jour de la tâche :', error);
         }
       } else {
         setEditingTask(null);
       }
     } else {
       // Si nous ajoutons une nouvelle tâche
       if (newTaskName) {
         try {
           await api.post('/tasks', { 
             id: null, // Explicitement envoyer id: null
             name: newTaskName 
           }); 
           handleFetchTasks(); 
           setNewTaskName(''); 
         } catch (error) {
           console.error('Échec de l\'ajout de la tâche :', error);
         }
       }
     }
   };
   ```

4. **handleEdit** :  
   Cette fonction permet de passer en mode édition une tâche spécifique. Lorsqu'une tâche est en mode édition, le champ de saisie est pré-rempli avec son nom et l'utilisateur peut modifier la tâche.

   ```typescript
   const handleEdit = (task: Task) => {
     setEditingTask(task);
     setNewTaskName(task.name);
   };
   ```

5. **handleAdd** :  
   Cette fonction réinitialise l'état de l'application pour permettre à l'utilisateur d'ajouter une nouvelle tâche. Elle vide également le champ de saisie.

   ```typescript
   const handleAdd = () => {
     setEditingTask(null); // Réinitialise l'état de modification
     setNewTaskName(''); // Vide le champ de saisie pour une nouvelle tâche
   };
   ```

### Améliorations CSS

Pour rendre l'interface plus agréable visuellement, j'ai ajouté quelques petites touches de style.

Exemple de la partie de code où j'ai ajouté ces touches CSS :

```tsx
<Box display="flex" 
  justifyContent="center" 
  alignItems="center" 
  gap={1} 
  width="95%" 
  sx={{ 
    mb: 3,
    backgroundColor: '#fff9fb',
    padding: 2,
    borderRadius: 2,
    boxShadow: '0 4px 15px rgba(219, 112, 147, 0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid #fce4ec'
  }}
>
```


