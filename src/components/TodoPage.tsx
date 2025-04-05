import { Check, Delete, Edit } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {

  //Différents states 
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskName, setNewTaskName] = useState<string>('');

  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));


  //Suppression d'une tâche
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      handleFetchTasks(); // Rafraîchit la liste des tâches après suppression
    } catch (error) {
      console.error('Échec de la suppression de la tâche :', error);
    }
  };
  

  //Enregistrement d'une tâche 
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


  //Ajout d'une nouvelle tâche 
  const handleAdd = () => {
    setEditingTask(null); // Réinitialise l'état de modification
    setNewTaskName(''); // Vide le champ de saisie pour une nouvelle tâche
  };
  
  // Fonction pour commencer l'édition d'une tâche
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setNewTaskName(task.name);
  };

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container sx={{ 
      maxWidth: '700px !important',
      margin: '0 auto',
      padding: 4,
      backgroundColor: '#fff',
      borderRadius: 3,
      boxShadow: '0 10px 30px rgba(219, 112, 147, 0.2), 0 6px 10px rgba(0,0,0,0.1)',
      mt: 5,
      mb: 5,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '8px',
        background: 'linear-gradient(90deg, #f78fb3, #f8a5c2)',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
      }
    }}>
      <Typography variant="h4" sx={{ 
        textAlign: 'center', 
        mb: 4, 
        fontWeight: 'bold',
        color: '#db7093',
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        letterSpacing: '0.5px'
      }}>
        Liste de Tâches
      </Typography>
    
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
        <TextField 
          size="small" 
          value={newTaskName} 
          onChange={(e) => setNewTaskName(e.target.value)} 
          fullWidth 
          sx={{ 
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#f8bbd0',
              },
              '&:hover fieldset': {
                borderColor: '#f06292',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ec407a',
              },
            },
            '& .MuiInputBase-input': {
              color: '#ad1457',
            }
          }} 
          placeholder="Nouvelle tâche"
        />
        <Box>
          <IconButton 
            color="success" 
            disabled={!newTaskName} 
            onClick={handleSave}
            sx={{
              backgroundColor: newTaskName ? '#ec407a' : 'transparent',
              color: newTaskName ? 'white' : 'rgba(0,0,0,0.26)',
              '&:hover': {
                backgroundColor: newTaskName ? '#d81b60' : 'transparent',
              },
              transition: 'all 0.2s ease',
              boxShadow: newTaskName ? '0 4px 8px rgba(236, 64, 122, 0.3)' : 'none',
            }}
          >
            <Check />
          </IconButton>
        </Box>
      </Box>
    
      <Box sx={{ 
        maxHeight: '350px', 
        maxWidth : '630px',
      }}>
        {/* Affichage de la liste des tâches */}
        {tasks.map((task) => (
          <Box 
            key={task.id} 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            gap={1} 
            width="100%"
            sx={{ 
              mb: 2,
              backgroundColor: 'white',
              padding: 1.5,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(219, 112, 147, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(219, 112, 147, 0.25)',
                transform: 'translateY(-2px)'
              },
              border: editingTask?.id === task.id ? '2px solid #ec407a' : '1px solid #fce4ec'
            }}
          >
            <TextField 
              size="small" 
              value={editingTask?.id === task.id ? newTaskName : task.name} 
              disabled={editingTask?.id !== task.id}
              onChange={(e) => {
                if (editingTask?.id === task.id) {
                  setNewTaskName(e.target.value);
                }
              }}
              fullWidth 
              sx={{ 
                '& .MuiInputBase-input': {
                  cursor: 'default',
                  color: '#ad1457',
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-disabled': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '& input': {
                      color: '#ad1457',
                      opacity: 0.8,
                    }
                  }
                }
              }} 
            />
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {/* Boutons de sauvegarde et d'annulation qui apparaissent uniquement en mode édition */}
              {editingTask?.id === task.id ? (
                <>
                  <IconButton 
                    onClick={handleSave}
                    sx={{
                      backgroundColor: '#ec407a',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#d81b60',
                      },
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 8px rgba(236, 64, 122, 0.3)',
                      padding: '6px',
                    }}
                  >
                    <Check sx={{ fontSize: '1.2rem' }} />
                  </IconButton>
                  <IconButton 
                    onClick={() => setEditingTask(null)}
                    sx={{
                      backgroundColor: '#f8bbd0',
                      color: '#ad1457',
                      '&:hover': {
                        backgroundColor: '#f48fb1',
                      },
                      transition: 'all 0.2s ease',
                      padding: '6px',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>✕</span>
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton 
                    onClick={() => handleEdit(task)}
                    sx={{
                      backgroundColor: '#f8bbd0',
                      color: '#ad1457',
                      '&:hover': {
                        backgroundColor: '#f48fb1',
                      },
                      transition: 'all 0.2s ease',
                      padding: '6px',
                    }}
                  >
                    <Edit sx={{ fontSize: '1.2rem' }} />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(task.id)}
                    sx={{
                      color: '#e91e63',
                      '&:hover': {
                        backgroundColor: 'rgba(233, 30, 99, 0.1)',
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Delete />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <Button 
          variant="outlined" 
          onClick={handleAdd}
          sx={{
            borderColor: '#ec407a',
            color: '#ec407a',
            '&:hover': {
              backgroundColor: '#ec407a',
              borderColor: '#ec407a',
              color: 'white',
              boxShadow: '0 4px 12px rgba(236, 64, 122, 0.3)',
            },
            fontWeight: 'medium',
            borderRadius: '25px',
            padding: '8px 24px',
            textTransform: 'none',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
          }}
        >
          Ajouter une tâche
        </Button>
      </Box>
    </Container>
  );
}

export default TodoPage;