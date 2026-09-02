const fs = require('fs');

function fixExpandedImage(content) {
  // We need to swap the metadata div and the image div, and change the image classes.
  // The current structure is:
  // <div className="flex gap-4 mb-X...">
  //   {simboloImg && <img className="... h-16 w-16 border bg-zinc-950/50 p-1 ..." />}
  //   <div className="flex flex-col gap-1 flex-1">
  //     {metadata...}
  //   </div>
  // </div>

  // We can use regex to find this block and swap them.
  // Since the metadata block can be large, it's easier to replace the image block where it is with empty string,
  // and append the new image block after the metadata div.
  
  // First, find the image block
  const imgRegex = /\{\s*simboloImg\s*&&\s*\(\s*<img\s+src=\{simboloImg\}[^>]+>\s*\)\s*\}/g;
  
  // Actually, let's just replace the exact fragments we inserted before.
  // Before we do that, we can just replace the old inserted fragments.
  
  // AbasPanel.tsx replacement:
  content = content.replace(
    /{\s*simboloImg && \(\s*<img\s+src={simboloImg}\s+alt=""\s+className="h-16 w-16 rounded border border-zinc-800 bg-zinc-950\/50 object-contain p-1 shrink-0"\s+loading="lazy"\s*\/>\s*\)\s*}/g,
    ''
  );

  // Now, we need to append the image at the end of the metadata div.
  // The metadata div ends with something like:
  //   <span className="text-zinc-400">{dados}</span>
  // </div>
  // )}
  // </div>
  // </div> // this is the end of the flex gap-4 div
  // But each file has different metadata fields.

  // So let's find: `</div>\n                                  </div>\n                                </div>\n\n                              </div>\n                            </Collapse>`
  return content;
}

// Let's do this more safely by writing specific scripts for each file's exact layout.
