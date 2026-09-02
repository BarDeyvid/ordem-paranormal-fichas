const fs = require('fs');

let content = fs.readFileSync('src/components/ModalPoderes.tsx', 'utf8');

const oldProps2 = "Pre_Codigo_Afinidade?: number | null;\r\n  };";
const newProps2 = "Pre_Codigo_Afinidade?: number | null;\n    'Automatico?'?: string | null;\n    'Automatico?_Afinidade'?: string | null;\n  };";
if (content.includes("Pre_Codigo_Afinidade?: number | null;\n  };")) {
  content = content.replace("Pre_Codigo_Afinidade?: number | null;\n  };", newProps2);
} else if (content.includes("Pre_Codigo_Afinidade?: number | null;\r\n  };")) {
  content = content.replace("Pre_Codigo_Afinidade?: number | null;\r\n  };", newProps2);
}

fs.writeFileSync('src/components/ModalPoderes.tsx', content);
