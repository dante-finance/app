import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import Kyc from '../../assets/img/KYC_logo.png';

import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';

import ListItemLink from '../ListItemLink';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountButton from './AccountButton';
import LinkExternal from '../LinkExternal';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    color: '#FFF',
    'background-color': 'rgba(104, 76, 172, 0.9)',
    // borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '10px',
    marginBottom: '3rem',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
    backgroundColor: 'rgba(104, 76, 172, 0.9)',
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    fontFamily: 'Augusta',
    fontSize: '30px',
    flexGrow: 1,
  },
  toolbarTitleMobile: {
    fontFamily: 'Augusta',
    color: '#FFF',
  },
  link: {
    textTransform: 'uppercase',
    color: '#FFF',
    fontSize: '20px',
    margin: theme.spacing(1, 2),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  brandLink: {
    textDecoration: 'none',
    color: '#FFF',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  navTitle: {
    fontFamily: 'Augusta',
  },
}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AppBar position="sticky" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {matches ? (
          <>
            <Typography variant="h2" color="inherit" noWrap className={classes.toolbarTitle}>
              <Link to="/" color="inherit" className={classes.brandLink}>
                Dante Finance
              </Link>
              <LinkExternal
                style={{ marginLeft: '20px' }}
                href="https://twitter.com/0xGuard/status/1499422602179317764"
              >
                <img src={Kyc} alt=""></img>
              </LinkExternal>
            </Typography>
            <Box mr={5}>
              <Link color="textPrimary" to="/purgatory" className={classes.link}>
                <span className={classes.navTitle}>Purgatory</span>
              </Link>
              <Link color="textPrimary" to="/eden" className={classes.link}>
                <span className={classes.navTitle}>Eden</span>
              </Link>
              <Link color="textPrimary" to="/inferno" className={classes.link}>
                <span className={classes.navTitle}>Inferno</span>
              </Link>
              <Link color="textPrimary" to="/minting" className={classes.link}>
                <span className={classes.navTitle}>Nfts</span>
              </Link>
              <a href="https://dantefinance.gitbook.io/dantefinance.com/" className={classes.link}>
                <span className={classes.navTitle}>Docs</span>
              </a>
            </Box>
            <AccountButton text="Connect" />
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h2" className={classes.toolbarTitleMobile} noWrap>
              Dante Finance
            </Typography>

            <Drawer
              className={classes.drawer}
              onClose={handleDrawerClose}
              variant="temporary"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItemLink primary="Home" to="/" />
                <ListItemLink primary="Purgatory" to="/purgatory" />
                <ListItemLink primary="Eden" to="/eden" />
                <ListItemLink primary="Inferno" to="/inferno" />
                <ListItemLink primary="Nfts" to="/minting" />
                <ListItem button component="a" href="https://dantefinance.gitbook.io/dantefinance.com/">
                  <ListItemText>Docs</ListItemText>
                </ListItem>
                <ListItem style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AccountButton text="Connect" />
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
