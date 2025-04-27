#!/bin/bash

# Function to handle copying and compressing
copy_and_compress() {
  local source_dir="$1"
  local destination_dir="$2"
  local exclude_folders="$3"
  local copy_list=("${@:4}")

  # Delete existing files in the destination directory
  rm -rf "$destination_dir"

  # Ensure the destination directory exists
  mkdir -p "$destination_dir"

  # Copy selected folders and files, conditionally excluding directories if not in dev build
  for item in "${copy_list[@]}"; do
    source_path="$source_dir/$item"
    destination_path="$destination_dir/$item"

    if [ -e "$source_path" ]; then
      if "$exclude_folders"; then
        rsync -av --exclude='psr' --exclude='fakerphp' --exclude='symfony' "$source_path" "$destination_dir"
        echo "Copied: $item (excluding psr, fakerphp, symfony)"
      else
        rsync -av "$source_path" "$destination_dir"
        echo "Copied: $item (no exclusions)"
      fi
    else
      echo "Warning: $item does not exist in the source directory."
    fi
  done

  echo -e "\nCopy completed."


  # Run the zip command and suppress output
  cd "$destination_dir"
  cd ..
  local dest_dir_basename=$(basename "$destination_dir")
  zip -rq "${dest_dir_basename}.zip" "$dest_dir_basename" -x "*.DS_Store"

  cd .. # go back to fluent-community plugin directory

  # Check for errors
  if [ $? -ne 0 ]; then
    echo "Error occurred while compressing."
    exit 1
  fi

  # Print completion message
  echo -e "\nCompressing Completed. builds/$(basename "$destination_dir").zip is ready. Check the builds directory. Thanks!\n"
}

withLoco=false
for arg in "$@"; do
  case "$arg" in
    "--loco")
      withLoco=true
      ;;
  esac
done

if "$withLoco"; then
  node i18n.node.js
  echo -e "\nExtracting Loco Translations\n"
  # shellcheck disable=SC2164
  wp loco extract easy-code-manager
  echo -e "\Syncing Loco Translations\n"
  wp loco sync easy-code-manager
    # shellcheck disable=SC2164
  echo -e "\nLoco Translations synced\n"
fi

# Get args from command line
nodeBuild=false
devBuild=false

for arg in "$@"; do
  case "$arg" in
    "--node-build")
      nodeBuild=true
      ;;
    "--dev_build")
      devBuild=true
      ;;
  esac
done

if "$nodeBuild"; then
  echo -e "\nBuilding Main App\n"
  # shellcheck disable=SC2164
  npx mix --production
  echo -e "\nBuild Completed\n"
fi

# Copy and compress Fluent Boards
copy_and_compress "." "builds/easy-code-manager" "" "app" "readme.txt" "dist" "language" "easy-code-manager.php" "readme.txt" "index.php"

