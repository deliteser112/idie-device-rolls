import React from 'react';
import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Grid, Avatar, Typography, CardContent, Tooltip } from '@mui/material';
//
import SvgIconStyle from '../../../components/SvgIconStyle';
// utils
import stringAvatar from '../../../utils/stringAvatar';
import DiceMoreButton from './DiceMoreButton';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 5)',
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 42,
  height: 42,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2)
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

DiceCard.propTypes = {
  dice: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
};

export default function DiceCard({ dice, onDelete }) {
  const { _id, did, name, owner, coverImg, actionItems, createdAt } = dice;

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ position: 'relative' }}>
        <CardMediaStyle>
          <SvgIconStyle
            color="paper"
            src="/static/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 26,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper'
            }}
          />
          <Tooltip title={`${owner.name.first} ${owner.name.last}`} placement="top">
            <AvatarStyle {...stringAvatar(`${owner.name.first} ${owner.name.last}`)} />
          </Tooltip>

          <Box sx={{ position: 'absolute', top: 5, right: 5, zIndex: 1 }}>
            <DiceMoreButton onDelete={() => onDelete(_id)} editLink={`${PATH_DASHBOARD.dices}/${_id}/edit`} />
          </Box>

          <CoverImgStyle alt={name} src={coverImg} />
        </CardMediaStyle>

        <CardContent
          sx={{pt: 4}}
        >
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {new Date(Number(createdAt)).toDateString()}
          </Typography>
          
          <Typography variant="body1" sx={{ borderBottom: '1px dotted lightgrey' }}>Name: {name}</Typography>
          <Typography variant="body1" sx={{ borderBottom: '1px dotted lightgrey' }}>did: {did}</Typography>
          <Typography variant="body2" sx={{ borderBottom: '1px dotted lightgrey' }}> Actions: &nbsp;
            {actionItems.map((item, index) => <span key={index}>{item.name}</span>)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
