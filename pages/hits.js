import { useState } from 'react';
import { TextField, MenuItem, Button, Grid, Box, Autocomplete, Typography, Divider, IconButton, Menu, MenuItem as MUIMenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MoreVertIcon from '@mui/icons-material/HelpOutline';
import axios from 'axios';

export default function Hits() {



  const [publisher, setPublisher] = useState('');
  const [publisherOptions, setPublisherOptions] = useState([]);
  const [reviews, setReviews] = useState('');
  const [score, setScore] = useState('');
  const [price, setPrice] = useState('');
  const [genres, setGenres] = useState([]);
  const [releaseDate, setReleaseDate] = useState(null);
  const [hitProbability, setHitProbability] = useState(null);
  const [avgCopies, setAvgCopies] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const availableGenres = [
    'Action', 'Adventure', 'Casual', 'Early Access', 'Free to Play',
    'Indie', 'RPG', 'Racing', 'Simulation', 'Sports', 'Strategy'
  ]; // Ejemplo de géneros

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      publisher,
      avgCopies,
      reviews,
      score,
      price,
      genres,
      releaseDate,
    };
    //console.log('Enviando datos:', { publisher, reviews, score, price, genres, releaseDate });

    try {
      const response = await axios.post('http://98.83.142.2/predict-hits-model', data);
      const  hitProb  = response.data;
      setHitProbability(hitProb.hits[0][1]*100);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };
  const handleInputChange = async (event, value) => {
    if (value.length > 0) {
      try {
        const response = await axios.get(`http://98.83.142.2/publishers?q=${value}`);
        console.log(response.data[0].publishers);
        setPublisherOptions(response.data);  
      } catch (error) {
        console.error('Error fetching publishers:', error);
      }
    }
  };
  // Función para manejar la selección de un publisher
  const handlePublisherChange = (event, newValue) => {
    setPublisher(newValue);

    // Buscar las copias promedio en base al publisher seleccionado
    const selectedPublisher = publisherOptions.find(option => option.publishers === newValue);
    
    if (selectedPublisher) {
      setAvgCopies(selectedPublisher.avg_publisher_copies);
    } else {
      setAvgCopies(0);  
    }
  };
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        
        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Predicción de Hits</Typography>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            color='primary'
            size='large'
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
          >
            <MUIMenuItem onClick={handleClose}>
              Instructivo
            </MUIMenuItem>
            <Box sx={{ p: 2 }}>
            <Typography variant="body1">
                1. Selecciona el nombre del publisher desde el menú desplegable. Si no aparece el tuyo, puedes escribir uno nuevo.
              </Typography>
              <Typography variant="body1">
                2. Ingresa las ventas promedio de tu publisher. Se completa automaticamente al seleccionar un publisher de la lista. Puede ser modificado.
              </Typography>
              <Typography variant="body1">
                3. Introduce el número de reviews y el porcentaje de reviews positivas que tengas, o sean tu objetivo.
              </Typography>
              <Typography variant="body1">
                4. Especifica el precio del juego y selecciona los géneros.
              </Typography>
              <Typography variant="body1">
                5. Elige la fecha de salida y haz clic en "Enviar". Debe ser previa a la fecha actual para obtener mejores resultados.
              </Typography>
              <Typography variant="body1">
                6. La probabilidad de convertirse en hit se mostrará en el lado derecho.
              </Typography>
            </Box>
          </Menu>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <div style={
          {display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexDirection: 'column',
          padding: '2rem',
          margin: '2rem',
          borderRadius: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white'
        }
        }>
        <Grid item xs={12}>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={3}>
              {/* Mitad Izquierda */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  {/* Publisher */}
                  <Grid item xs={12}>
                  <Autocomplete
                    options={publisherOptions.map(option => option.publishers)}  
                    value={publisher}
                    onInputChange={handleInputChange}  
                    onChange={handlePublisherChange}  
                    renderInput={(params) => (
                      <TextField {...params} label="Nombre del Publisher" variant="outlined" fullWidth />
                    )}
                    freeSolo
                  />
                  </Grid>
                  {/* Número de Copias Promedio del Publisher*/}
                  <Grid item xs={12}>
                    <TextField
                      label="Número de Copias Promedio del Publisher"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={avgCopies}
                      onChange={(e) => setAvgCopies(e.target.value)}
                    />
                  </Grid>

                  {/* Número de Reviews */}
                  <Grid item xs={12}>
                    <TextField
                      label="Número de Reviews"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={reviews}
                      onChange={(e) => setReviews(e.target.value)}
                    />
                  </Grid>

                  {/* Puntaje de Reviews */}
                  <Grid item xs={12}>
                    <TextField
                      label="Puntaje de Reviews (0-100)"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>

                  {/* Precio */}
                  <Grid item xs={12}>
                    <TextField
                      label="Precio"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      InputProps={{
                        startAdornment: <span>$</span>,
                      }}
                    />
                  </Grid>

                  {/* Géneros */}
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={availableGenres}
                      getOptionLabel={(option) => option}
                      value={genres}
                      onChange={(event, newValue) => setGenres(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} label="Géneros" variant="outlined" fullWidth />
                      )}
                    />
                  </Grid>

                  {/* Fecha de Salida */}
                  <Grid item xs={12}>
                    <DatePicker
                      label="Fecha de Salida"
                      value={releaseDate}
                      onChange={(newValue) => setReleaseDate(newValue)}
                      renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                    />
                  </Grid>

                  {/* Botón de Enviar */}
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Enviar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

               {/* Resultados */}
        <Grid item xs={12} md={6}>
          {hitProbability !== null && (
            <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' }}>
              <Typography variant="h6">Probabilidad de Ser un Hit</Typography>
              <Typography variant="h4" color="primary">
                {hitProbability.toFixed(2)}%
              </Typography>
            </Box>
          )}
        </Grid>
            </Grid>
          </form>
        </Grid>
        </div>
      </Grid>
    </Box>
  );
}
