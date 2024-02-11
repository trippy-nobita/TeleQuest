import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import './SearchUser.css';

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  const handleInputChange = (event) => {
    const value = event.target.value.trim();
    setSearchTerm(value);

    if (value.length > 0) {
      fetchUsers(value);
    } else {
      setSearchResults([]);
    }
  };

  const fetchUsers = async (username) => {
    try {
      const response = await axios.get(`https://api.github.com/search/users?q=${username}`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        }
      });
      if (response.data && response.data.items) {
        const users = response.data.items;
        const promises = users.map(user => fetchUserDetails(user.login));
        const results = await Promise.all(promises);
        // Sort the results based on the number of followers in descending order
        const sortedResults = results.filter(user => user.followers !== undefined).sort((a, b) => b.followers - a.followers);
        setSearchResults(sortedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setSearchResults([]);
    }
  };

  const fetchUserDetails = async (username) => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return {};
    }
  };

  return (
    <div>
      <div className = "searchBar"> <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={handleInputChange}
        fullWidth
      />
    </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
           <TableRow>
              <TableCell style = {{color: "white", fontStyle: "bold"}}>Username</TableCell>
              <TableCell style = {{color: "white", fontStyle: "bold"}}>Number of Followers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map(user => (
              <TableRow key={user.id}>
                <TableCell > <div className= "output"> {user.login} </div> </TableCell>
                <TableCell><div className= "output"> {user.followers}  </div> </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default SearchUser;
