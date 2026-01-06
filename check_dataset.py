import pandas as pd

df = pd.read_csv('student_depression_dataset_to_use_final.csv')
print(f'Dataset Shape: {df.shape}')
print(f'\nColumns: {list(df.columns)}')
print(f'\nDepression Distribution:')
print(df['Depression'].value_counts())
print(f'\nSample Data (first 2 rows):')
print(df.head(2).to_string())
