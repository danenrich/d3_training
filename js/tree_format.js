// Tree format definition
var TREE_FORMAT = [
  //  0. left position
  0,
  //  1. top position
  0,
  //  2. show buttons ("+" and "-" images)
  false,
  //  3. button images: collapsed state, expanded state, blank image
  ['', '', 'images/blank.gif'],
  //  4. size of buttons: width, height, indent amount for childless nodes
  [0, 0, 0],
  //  5. show icons ("folder" and "document")
  true,
  //  6. icon images: closed folder, opened folder, document
  ['img/fc.gif', 'img/fe.gif', 'img/d.gif'],
  //  7. size of icons: width, height
  [0, 0],
  //  8. indent amount for each level of the tree
  [0, 8, 16, 24, 32, 48, 64, 80, 96, 112, 128],
  //  9. background color for the tree
  '',
  // 10. default CSS class for nodes
  'treeNode',
  // 11. individual CSS classes for levels of the tree
  ['treeNode', 'treeNode', 'treeNode'],
  // 12. "single branch" mode
  false,
  // 13. padding and spacing values for all nodes
  [0, 0],
  // 14. "explorer-like" mode
  true,
  // 15. images for "explorer-like" mode
  ['images/e_folder_opened.gif', 'images/e_folder_closed.gif', 'images/e_document.gif', '', '', '', '', '', '', ''],
  // 16. size of images for "explorer-like" mode: width, height
  [19, 16],
  // 17. store tree state into cookies
  true,
  // 18. relative positioning mode
  true,
  // 19. initial space for the relatively positioned tree: width, height
  [200, 50],
  // 20. resize container of the relatively positioned tree
  true,
  // 21. change background-color and style for selected node
  true,
  // 22. background color for unselected node, background color for selected node, class for selected node
  ['', '#b7cefe', ''],
  // 23. text wrapping margin
  185,
  // 24. vertical alignment for buttons and icons
  'middle'
];
