# SSH Authentication for GitHub — Complete Guide

> **Purpose:** Never type a GitHub password again. One-time setup per machine.
> **Last Updated:** Jan 28, 2026

---

## How SSH Authentication Works

```
┌─────────────────┐                    ┌─────────────────┐
│   YOUR MAC      │                    │     GITHUB      │
│                 │                    │                 │
│  Private Key    │◄──── Proves ──────►│   Public Key    │
│  (id_ed25519)   │      Identity      │   (stored)      │
│  NEVER SHARE    │                    │                 │
└─────────────────┘                    └─────────────────┘
```

**What happens:**

1. You generate a **key pair** on your Mac: a private key + public key
2. The **private key** stays on your Mac forever (in `~/.ssh/` folder)
3. You give GitHub your **public key** (safe to share - it's like a lock)
4. When you push, your Mac proves it has the private key that matches the public key
5. GitHub says "yep, that's you" and allows the push

**The keys:**

- `~/.ssh/id_ed25519` — **Private key** (NEVER share this)
- `~/.ssh/id_ed25519.pub` — **Public key** (this goes to GitHub)

---

## One-Time Setup (5 minutes)

### Step 1: Check for Existing Keys

```bash
ls -la ~/.ssh/
```

If you see `id_ed25519` and `id_ed25519.pub`, you already have keys — skip to Step 3.

### Step 2: Generate New SSH Key

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

**Prompts:**

- `Enter file in which to save the key` → Press **Enter** (use default: `~/.ssh/id_ed25519`)
- `Enter passphrase` → Press **Enter** (no passphrase) or type one for extra security
- `Enter same passphrase again` → Press **Enter**

**What this creates:**

```
~/.ssh/
├── id_ed25519      ← Private key (SECRET - never share)
└── id_ed25519.pub  ← Public key (give this to GitHub)
```

### Step 3: Add Key to SSH Agent

The SSH agent remembers your key so you don't have to load it manually each time.

```bash
# Start the agent
eval "$(ssh-agent -s)"

# Add your key to the agent
ssh-add ~/.ssh/id_ed25519
```

**Optional:** To make this persist across restarts, add to `~/.ssh/config`:

```bash
# Create or edit the config file
nano ~/.ssh/config
```

Add these lines:

```
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```

Save with `Ctrl+O`, Enter, then `Ctrl+X`.

### Step 4: Copy Public Key to Clipboard

```bash
pbcopy < ~/.ssh/id_ed25519.pub
```

Your public key is now copied. It looks like:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGg7... your-email@example.com
```

### Step 5: Add Public Key to GitHub

1. Go to [github.com/settings/keys](https://github.com/settings/keys)
2. Click **"New SSH Key"**
3. **Title:** "MacBook Pro" (or whatever describes this machine)
4. **Key type:** Authentication Key
5. **Key:** Paste (Cmd+V) — this is what you copied in Step 4
6. Click **"Add SSH Key"**

### Step 6: Test the Connection

```bash
ssh -T git@github.com
```

You should see:

```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

If you see "Are you sure you want to continue connecting?" — type `yes`.

---

## Using SSH with Repositories

### For New Repos — Clone with SSH

When cloning, use the SSH URL (not HTTPS):

```bash
# ✅ SSH (use this)
git clone git@github.com:username/repo-name.git

# ❌ HTTPS (avoid)
git clone https://github.com/username/repo-name.git
```

### For Existing Repos — Switch to SSH

If you already cloned with HTTPS and want to switch:

```bash
# Check current remote
git remote -v

# If it shows https://, switch to SSH:
git remote set-url origin git@github.com:username/repo-name.git

# Verify the change
git remote -v
```

---

## Quick Reference

### Check Your Setup

```bash
# List your keys
ls -la ~/.ssh/

# See which keys are loaded in agent
ssh-add -l

# Test GitHub connection
ssh -T git@github.com

# Check repo's remote URL
git remote -v
```

### Common SSH URLs

| Service | SSH URL Format |
|---------|----------------|
| GitHub | `git@github.com:username/repo.git` |
| GitLab | `git@gitlab.com:username/repo.git` |
| Bitbucket | `git@bitbucket.org:username/repo.git` |

---

## Troubleshooting

### "Permission denied (publickey)"

Your key isn't being recognized. Try:

```bash
# Make sure agent is running
eval "$(ssh-agent -s)"

# Add your key
ssh-add ~/.ssh/id_ed25519

# Test again
ssh -T git@github.com
```

### "Could not open a connection to your authentication agent"

The SSH agent isn't running:

```bash
eval "$(ssh-agent -s)"
```

### "Warning: Permanently added 'github.com' to the list of known hosts"

This is normal on first connection — not an error.

### Key Already Exists When Generating

If `ssh-keygen` says the key already exists:

- Type `n` to NOT overwrite (keep your existing key)
- Use your existing key — skip to Step 3

### Need to Use Multiple GitHub Accounts

Create different keys and configure `~/.ssh/config`:

```
# Personal account
Host github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal

# Work account
Host github.com-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
```

Then clone with: `git clone git@github.com-work:company/repo.git`

---

## Summary

1. **Keys live in:** `~/.ssh/` folder on your Mac
2. **Private key:** `id_ed25519` — NEVER share
3. **Public key:** `id_ed25519.pub` — Give to GitHub
4. **One-time setup per machine** — works for all repos
5. **Use SSH URLs:** `git@github.com:user/repo.git`

Once set up, you'll never type a password for GitHub again.
