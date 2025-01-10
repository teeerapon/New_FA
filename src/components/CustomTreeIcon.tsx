import React from 'react';
import { TreeItem, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { styled, alpha } from '@mui/material/styles';

interface CustomTreeItemProps extends TreeItemProps {
  labelIcon?: React.ElementType;  // Allow passing an icon component
  onClick?: () => void; // รับฟังก์ชัน onClick เป็น option
}

const CustomTreeItem = styled(({ labelIcon: IconComponent, label, ...props }: CustomTreeItemProps) => (
  <TreeItem {...props}
    label={
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {IconComponent && <IconComponent style={{ marginRight: 8 }} />}
        {label}
      </div>
    }
  />
))(({ theme }) => ({
  color: theme.palette.grey[200],
  '& .MuiTreeItem-content': {
    borderRadius: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    overflow: 'clip',
    '& .MuiTreeItem-label': {
      fontSize: '0.95rem',
      fontWeight: 500,
    },
  },
  '& .MuiTreeItem-groupTransition': {
    marginLeft: theme.spacing(2.5),
    padding: theme.spacing(0),
    borderLeft: '1px solid',
    borderColor: theme.palette.divider,
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

export default CustomTreeItem;
