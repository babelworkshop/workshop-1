const captainsLog = (babel) => {
  const { types: t } = babel;
  
  return {
    name: "captains-log", // not required
    visitor: {
      CallExpression(path) {
        
        const { callee } = path.container.expression;
        if(callee.object.name !== 'console') return;
        if(callee.property.name !== 'log') return;
        
        const { line, column } = path.node.loc.start;
        const prefix = `${line},${column}`;

        path.node.arguments.unshift(t.stringLiteral(prefix));

        const fName = getParentFunction(path);
        if (fName) path.node.arguments.unshift(t.stringLiteral(fName));
      }
    }
  };
}

function getParentFunction(path){
  let currentPath = path;
  
  while(
    currentPath &&
    currentPath.type !== 'FunctionDeclaration'
  )
    currentPath = currentPath.parentPath;

  return currentPath ? currentPath.node.id.name: null;;
}
export default captainsLog;
