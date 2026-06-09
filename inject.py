import glob, io, re

for f in glob.glob('*.html'):
    with io.open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    script_tag = '<script src="mobile-block.js"></script>'
    if script_tag not in content:
        # insert before </head>
        new_content = re.sub(r'(</head>)', f'{script_tag}\n\\1', content, flags=re.IGNORECASE)
        
        if new_content != content:
            with io.open(f, 'w', encoding='utf-8', newline='') as file:
                file.write(new_content)
            print('Injected into', f)
