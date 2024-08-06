"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography, ThemeProvider, createTheme } from "@mui/material";
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setFilteredInventory(inventory);
    } else {
      const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredInventory(filtered);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        bgcolor={theme.palette.background.default}
        padding={3}
      >
        <Button variant="contained" onClick={() => setDarkMode(!darkMode)} sx={{ mb: 2 }}>
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </Button>
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="background.paper"
            borderRadius={2}
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ transform: 'translate(-50%,-50%)' }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
          Add New Item
        </Button>
        <TextField
          id="search-bar"
          label="Search Ingredients"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            mb: 2,
            bgcolor: 'background.paper',
            width: '80%',
            borderRadius: 1,
            input: { borderRadius: 1 },
          }}
        />
        <Box border="1px solid" borderColor="divider" width="80%" minHeight="600px" bgcolor="background.paper" borderRadius={2} p={2}>
          <Box
            width="100%"
            height="100px"
            bgcolor="primary.main"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius={1}
            mb={2}
          >
            <Typography variant="h4" color="text.primary" textAlign="center">
              Inventory Items
            </Typography>
          </Box>
          <Stack width="100%" height="600px" spacing={2} overflow="auto">
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="100px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="background.default"
                borderRadius={1}
                p={2}
                mb={2}
              >
                <Typography variant="h6" color="text.primary" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="text.primary" textAlign="center">
                  Quantity: {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="primary" onClick={() => addItem(name)}>
                    Add
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

