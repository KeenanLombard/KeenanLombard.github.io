#!/usr/bin/env python3
"""Restore the verified source snapshot from before the studio refinement."""
from pathlib import Path
import hashlib
import json
import subprocess
import tarfile

snapshot_dir = Path(__file__).resolve().parent
root = snapshot_dir.parent
manifest = json.loads((snapshot_dir / 'baseline.json').read_text())
archive = snapshot_dir / manifest['archive']
if hashlib.sha256(archive.read_bytes()).hexdigest() != manifest['sha256']:
    raise SystemExit('Snapshot checksum does not match. No files were changed.')
with tarfile.open(archive, 'r:gz') as source:
    members = source.getmembers()
    for member in members:
        target = root / member.name
        if not member.isfile() or not target.resolve().is_relative_to(root):
            raise SystemExit('Unexpected archive entry. No files were changed.')
        data = source.extractfile(member).read()
        if hashlib.sha256(data).hexdigest() != manifest['files'][member.name]:
            raise SystemExit('Snapshot file checksum does not match. No files were changed.')
    source.extractall(root, filter='data')
subprocess.run(['npm', 'run', 'build'], cwd=root, check=True)
print('Restored the original website. Additional assets and the snapshot were preserved.')
