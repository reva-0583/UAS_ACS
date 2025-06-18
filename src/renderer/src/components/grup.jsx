import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Badge,
  Button,
  Grid,
  Box
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

export default function GrupPage() {
  const [grupFolders, setGrupFolders] = useState([]);
  const [mentionCounts, setMentionCounts] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '';

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }
    window.api.getGroupFolders(username).then(setGrupFolders);
    window.api.getMentionCountsByFolder(username).then(setMentionCounts);
  }, [username, navigate]);

  const getMentionCount = (id_folder) => {
    const data = mentionCounts.find(item => item.id_group_folder === id_folder);
    return data ? data.jumlah : 0;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Folder Grup Anda
      </Typography>

      {grupFolders.length > 0 ? (
        <Grid container spacing={2}>
          {grupFolders.map((folder) => {
            const mentionCount = getMentionCount(folder.id_group_folder);
            return (
              <Grid item xs={12} sm={6} md={4} key={folder.id_group_folder}>
                <Badge
                  badgeContent={mentionCount}
                  color="error"
                  overlap="circular"
                >
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardActionArea
                      component={RouterLink}
                      to={`/grup-detail/${folder.id_group_folder}`}
                      sx={{ height: '100%' }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1}>
                          <GroupIcon color="primary" />
                          <Typography variant="h6">
                            {folder.judul}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Badge>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Kamu belum tergabung grup.
        </Typography>
      )}

      <Box mt={4} display="flex" flexWrap="wrap" gap={2}>
        <Button variant="contained" color="primary" onClick={() => navigate('/addGrup')}>
          Add Grup
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/addMember')}>
          Add Member
        </Button>
        <Button variant="outlined" color="inherit" onClick={() => navigate('/dashboard')}>
          Back
        </Button>
      </Box>
    </Container>
  );
}
